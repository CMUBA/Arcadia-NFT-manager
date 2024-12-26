const fs = require('node:fs');
const path = require('node:path');

function generateMetadata(totalHeroes) {
    // Configuration
    const OUTPUT_DIR = './assets/metadata';
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate metadata for each hero
    for (let i = 1; i <= totalHeroes; i++) {
        const metadata = {
            name: `Hero #${i}`,
            description: `Hero ${i} in the Heroes collection`,
            image: '',
            external_url: `https://arcadia.cmuba.org/${i}`,
            attributes: [
                {
                    "trait_type": "Hero Number",
                    "value": i.toString()
                },
                {
                    "trait_type": "race",
                    "value": "human"
                },
                {
                    "trait_type": "class",
                    "value": "warrior"
                },
                {
                    "trait_type": "gender",
                    "value": "male"
                }
            ]
        };

        // Write metadata to JSON file
        const fileName = path.join(OUTPUT_DIR, `${i}.json`);
        fs.writeFileSync(fileName, JSON.stringify(metadata, null, 2));
        console.log(`Generated metadata for Hero #${i}`);
    }

    return { success: true, message: 'Metadata generation complete!' };
}

// 如果直接运行此文件
if (require.main === module) {
    const totalHeroes = process.argv[2] ? parseInt(process.argv[2]) : 10;
    generateMetadata(totalHeroes);
}

module.exports = { generateMetadata }; 