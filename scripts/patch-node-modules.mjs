import fs from 'fs';
import path from 'path';

// When a patch that should apply silently misses (e.g. an upstream version bump
// changed the target code), the build used to continue green and only fail at
// runtime. We now collect misses and, under PATCH_STRICT=1 (set this in CI),
// fail the build so a broken patch is caught before deploy.
const STRICT = process.env.PATCH_STRICT === '1';
const misses = [];

function patchFile(filePath, searchRegex, replace, checkString) {
    if (fs.existsSync(filePath)) {
        console.log(`Checking ${filePath}...`);
        let content = fs.readFileSync(filePath, 'utf8');

        // If checkString is provided and found, skip patching
        if (checkString && content.includes(checkString)) {
            console.log(`Already patched: ${filePath}`);
            return;
        }

        if (searchRegex.test(content)) {
            console.log(`Patching ${filePath}...`);
            content = content.replace(searchRegex, replace);
            fs.writeFileSync(filePath, content);
            console.log(`Successfully patched ${filePath}`);
        } else {
            console.warn(`\n⚠️  PATCH MISS: search pattern not found and not already patched in ${filePath}\n   (upstream may have changed — this patch did nothing)\n`);
            misses.push(filePath);
        }
    } else {
        console.log(`File not found: ${filePath}`);
    }
}

// 1. Patch SWC to remove native binary & WASM requirements
const swcDirs = [
    'node_modules/next-intl/node_modules/@swc/core',
    'node_modules/@swc/core'
];

swcDirs.forEach(basePath => {
    const swcPatch = 'fallbackBindings = { transform: () => Promise.resolve({ code: "" }), transformSync: () => ({ code: "" }), parse: () => Promise.resolve({}), parseSync: () => ({}), minify: () => Promise.resolve({}), minifySync: () => ({}) };';

    // Patch index.js to remove @swc/wasm requirement
    patchFile(
        path.join(basePath, 'index.js'),
        /fallbackBindings\s*=\s*(?:require\(["']@swc\/wasm["']\)|{\s*transform:[\s\S]*?});/g,
        swcPatch,
        'minifySync: () => ({}) };'
    );

    // Patch binding.js to ignore native binaries
    const bindingPath = path.join(basePath, 'binding.js');
    if (fs.existsSync(bindingPath)) {
        const mockContent = `
module.exports.resolveBinary = () => '';
module.exports.getTargetTriple = () => 'unknown';
module.exports.loadBinding = () => ({
    transform: () => Promise.resolve({ code: "" }),
    transformSync: () => ({ code: "" }),
    parse: () => Promise.resolve({}),
    parseSync: () => ({}),
});
`;
        if (!fs.readFileSync(bindingPath, 'utf8').includes('getTargetTriple = () => \'unknown\'')) {
            console.log(`Mocking ${bindingPath}...`);
            fs.writeFileSync(bindingPath, mockContent);
            console.log(`Successfully mocked ${bindingPath}`);
        } else {
            console.log(`Already mocked: ${bindingPath}`);
        }
    }
});

// 2. Patch OpenNext AWS to fix Windows ESM path bug in compileConfig
const openNextAwsConfigPath = 'node_modules/@opennextjs/aws/dist/build/compileConfig.js';
const openNextPatch = 'configPath = "file:///" + configPath.split(path.sep).join("/");';

// First, fix the broken line if it was botched by a previous run
const brokenFileRegex = /configPath\s*=\s*["']file:\/\/\/"\s*\+\s*configPath\.split\(path\.sep\)\.join\("\/"\);(?:\);)+/g;
patchFile(
    openNextAwsConfigPath,
    brokenFileRegex,
    openNextPatch
);

// Then apply the standard patch (if not already applied)
patchFile(
    openNextAwsConfigPath,
    /configPath\s*=\s*`file:\/\/\$\{configPath\}`;/g,
    openNextPatch,
    'configPath.split(path.sep).join("/")'
);

// 3. Patch OpenNext AWS to bypass the problematic Next.js 16 config patch
const openNextAwsPatchPath = 'node_modules/@opennextjs/aws/dist/build/patch/patches/patchOriginalNextConfig.js';
patchFile(
    openNextAwsPatchPath,
    /export async function patchOriginalNextConfig\(options\) {/g,
    'export async function patchOriginalNextConfig(options) { return; // Bypassed due to Windows/ESM issues',
    'return; // Bypassed'
);

// 4. Patch OpenNext Cloudflare wrangler-external.js for Windows path + query bug
const wranglerExternalPath = 'node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/wrangler-external.js';
const newWranglerPatch = 'path: (() => { const [p, q] = path.split("?"); let abs = normalizePath(resolve(dirname(importer), p)); return abs; })(),';

patchFile(
    wranglerExternalPath,
    /path:\s*(?:normalizePath\(resolve\(dirname\(importer\),\s*path\)\),|\(\(\)\s*=>\s*{\s*const\s*\[p,\s*q\]\s*=\s*path\.split\(".*?"\);[\s\S]*?}\)\(\),)/g,
    newWranglerPatch,
    'const [p, q] = path.split("?")'
);

// 5. Patch Next.js compiled @vercel/og to remove ?module query string
const vercelOgEdgePath = 'node_modules/next/dist/compiled/@vercel/og/index.edge.js';
patchFile(
    vercelOgEdgePath,
    /\.wasm\?module/g,
    '.wasm',
    'resvg_wasm from "./resvg.wasm";'
);

// 6. Patch OpenNext Cloudflare turbopack.js for Windows path separator and relative path bugs
const turbopackPatchPath = 'node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/turbopack.js';

// 6a. Add path import if missing
patchFile(
    turbopackPatchPath,
    /import { patchCode }/g,
    'import path from "node:path";\nimport { patchCode }',
    'import path from "node:path";'
);

// 6b. Fix getInlinableChunks to handle backslashes
patchFile(
    turbopackPatchPath,
    /(?:file\.match\(\/\\\.next\[\\\\\\\\\/\]server\[\\\\\\\\\/\]chunks\[\\\\\\\\\/\]\/\)|file\.includes\("\.next\/server\/chunks\/"\)|file\.split\(path\.sep\)\.join\("\/"\)\.includes\("\.next\/server\/chunks\/"\))/g,
    'file.split(path.sep).join("/").includes(".next/server/chunks/")',
    'file.split(path.sep).join("/").includes(".next/server/chunks/")'
);

// 6c. Rewrite inlineChunksFn to produce STATIC ABSOLUTE paths with forward slashes
// This is the most robust way to ensure esbuild finds the files on Windows.
const newInlineChunksFn = `function inlineChunksFn(tracedFiles) {
    const chunks = getInlinableChunks(tracedFiles);
    return \`
  function requireChunk(chunkPath) {
    switch(chunkPath) {
\${chunks
        .map((chunk) => {
            const p = chunk.split(path.sep).join("/").split(".next/").pop();
            const abs = path.resolve(chunk).split(path.sep).join("/");
            return \`      case "\${p}": return require("\${abs}");\`;
        })
        .join("\\n")}
      default:
        throw new Error(\\\`Not found \\\${chunkPath}\\\`);
    }
  }
\`;
}`;

patchFile(
    turbopackPatchPath,
    /function inlineChunksFn\(tracedFiles\) \{[\s\S]*?\n\}/g,
    newInlineChunksFn,
    'const abs = path.resolve(chunk)'
);

if (misses.length > 0) {
    console.warn(`\n⚠️  ${misses.length} patch(es) missed their target. If the build or runtime misbehaves, these are the first suspects:\n   - ${misses.join('\n   - ')}\n`);
    if (STRICT) {
        console.error('PATCH_STRICT=1 → failing the build because a required patch did not apply.');
        process.exit(1);
    }
}

console.log('Node Modules Patching complete.');
