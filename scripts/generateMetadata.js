const fs = require('fs');
const path = require('path');

// Configuration
const TOTAL_HEROES = 10; // Change this to your desired number of heroes
const OUTPUT_DIR = './assets/metadata';
const IMAGE_BASE_URL = 'https://your-image-hosting-url.com/'; // Update this with your image URL

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate metadata for each hero
for (let i = 1; i <= TOTAL_HEROES; i++) {
    const metadata = {
        name: `Hero #${i}`,
        description: `Hero ${i} in the Heroes collection`,
        image: `${IMAGE_BASE_URL}/hero.png`, // All heroes use the same image
        external_url: `https://arcadia.cmuba.org/${i}`,
        attributes: [
            {
                trait_type: "Hero Number",
                value: i.toString()
            }
            // Add more attributes as needed
        ]
    };

    // Write metadata to JSON file
    const fileName = path.join(OUTPUT_DIR, `${i}.json`);
    fs.writeFileSync(fileName, JSON.stringify(metadata, null, 2));
    console.log(`Generated metadata for Hero #${i}`);
}

console.log('Metadata generation complete!'); 