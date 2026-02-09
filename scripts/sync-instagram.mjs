import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import https from 'https';

const PROFILE_URL = 'https://www.instagram.com/august.patisserie/';
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'content', 'instagram.json');
const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'instagram');

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

async function scrapeInstagram() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`Navigating to ${PROFILE_URL}...`);
    await page.goto(PROFILE_URL, { waitUntil: 'networkidle2' });

    // Scroll down
    await page.evaluate(async () => {
        window.scrollBy(0, window.innerHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    console.log('Extracting images...');
    const imageUrls = await page.evaluate(() => {
        const imgElements = Array.from(document.querySelectorAll('article img'));
        return imgElements
            .map(img => img.src)
            .slice(0, 12);
    });

    console.log(`Found ${imageUrls.length} images.`);

    if (imageUrls.length === 0) {
        console.log("Scraping failed, using seeded URLs from research phase...");
        // Seed URLs from previous browser session
        imageUrls.push(
            "https://instagram.fkul10-2.fna.fbcdn.net/v/t51.29350-15/362698333_828000988521474_1845795127925381603_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.fkul10-2.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QG0hOR7RHw0IzgSkuak-hzDXWJOxwKJZI3CSd4JwGdybTYGe-sxWPUkKqHJyfKI8M3EfhNEEL2Zc6xeaipXVxs_&_nc_ohc=FBojHkSzLJIQ7kNvwFSPAf8&_nc_gid=vNNFEX3ToHejrkywMYaK-w&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfpwUtv0ileiT_rxtZgK43O_hq4uIWct2V5fbKFoUu2IOw&oe=69629C91&_nc_sid=8b3546",
            "https://instagram.fkul10-2.fna.fbcdn.net/v/t51.29350-15/329421936_587212869538554_801610302024098562_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08_tt6&_nc_ht=instagram.fkul10-2.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QG0hOR7RHw0IzgSkuak-hzDXWJOxwKJZI3CSd4JwGdybTYGe-sxWPUkKqHJyfKI8M3EfhNEEL2Zc6xeaipXVxs_&_nc_ohc=OE4hhk8rP3EQ7kNvwEMJZRv&_nc_gid=vNNFEX3ToHejrkywMYaK-w&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfppdOvXRcvDay0jnwXk-zEdLYE5Y8tzI6bcIE4so0QoIQ&oe=69628607&_nc_sid=8b3546",
            "https://instagram.fkul10-2.fna.fbcdn.net/v/t51.2885-15/544820747_18029270312708297_7521895032258385677_n.jpg?stp=dst-jpg_e15_s640x640_tt6&_nc_ht=instagram.fkul10-2.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QG0hOR7RHw0IzgSkuak-hzDXWJOxwKJZI3CSd4JwGdybTYGe-sxWPUkKqHJyfKI8M3EfhNEEL2Zc6xeaipXVxs_&_nc_ohc=eRgFtLgokP4Q7kNvwHF4v63&_nc_gid=vNNFEX3ToHejrkywMYaK-w&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfprI3-l4GnTHCexVp8YNkYNQ296sm_Un4atrzDC9Q5KXw&oe=69628515&_nc_sid=8b3546"
        );
    }

    if (imageUrls.length > 0) {
        // Ensure directories exist
        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
        fs.mkdirSync(IMAGE_DIR, { recursive: true });

        const localImages = [];

        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            const filename = `insta-${i + 1}.jpg`;
            const filepath = path.join(IMAGE_DIR, filename);

            try {
                console.log(`Downloading ${filename}...`);
                await downloadImage(url, filepath);
                localImages.push(`/images/instagram/${filename}`);
            } catch (e) {
                console.error(`Failed to download ${url}:`, e);
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(localImages, null, 2));
        console.log(`Saved ${localImages.length} images to ${OUTPUT_FILE}`);
    } else {
        console.error('No images found.');
    }

    await browser.close();
}

scrapeInstagram();
