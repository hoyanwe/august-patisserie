// Script to remove Edge runtime exports for OpenNext migration
const fs = require('fs');
const path = require('path');

const files = [
    'src/app/[locale]/story/page.tsx',
    'src/app/[locale]/page.tsx',
    'src/app/[locale]/menu/[id]/page.tsx',
    'src/app/[locale]/menu/page.tsx',
    'src/app/[locale]/contact/page.tsx',
    'src/app/api/reviews/route.ts',
    'src/app/api/auth/[...nextauth]/route.ts',
    'src/app/api/admin/upload/route.ts',
    'src/app/api/admin/story/route.ts',
    'src/app/api/admin/reviews/route.ts',
    'src/app/api/admin/products/[id]/route.ts',
    'src/app/api/admin/products/route.ts',
    'src/app/api/admin/logout/route.ts',
    'src/app/api/admin/ingredients/route.ts',
    'src/app/api/admin/login/route.ts',
    'src/app/api/admin/home/route.ts',
    'src/app/api/admin/categories/route.ts',
    'src/app/api/admin/announcements/route.ts',
    'src/app/api/admin/contact/route.ts',
    'src/app/admin/(dashboard)/page.tsx',
    'src/app/admin/(dashboard)/products/[id]/page.tsx',
];

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove the edge runtime export line
        content = content.replace(/export const runtime = ['"]edge['"];?\r?\n/g, '');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Removed edge runtime from: ${file}`);
    } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
    }
});

console.log('\nDone! All Edge runtime exports have been removed.');
