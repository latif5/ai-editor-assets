const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join(__dirname, 'source');
const RESULT_DIR = path.join(__dirname, 'converted');

// Ensure result directory exists
if (!fs.existsSync(RESULT_DIR)) {
    fs.mkdirSync(RESULT_DIR, { recursive: true });
}

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.avif', '.svg'];

async function convertImages() {
    console.log('🚀 Starting image conversion to WebP...');
    console.log(`📂 Reading from: ${SOURCE_DIR}`);
    console.log(`💾 Saving to: ${RESULT_DIR}`);

    try {
        // Read source directory
        if (!fs.existsSync(SOURCE_DIR)) {
            console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
            return;
        }

        const files = fs.readdirSync(SOURCE_DIR);
        const imageFiles = files.filter(file => 
            IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())
        );

        if (imageFiles.length === 0) {
            console.log('⚠️ No image files found in source folder.');
            return;
        }

        console.log(`found ${imageFiles.length} images to process.`);

        // Process each file
        const promises = imageFiles.map(async (file) => {
            const sourcePath = path.join(SOURCE_DIR, file);
            
            // Create new filename with .webp extension
            const fileNameWithoutExt = path.parse(file).name;
            const destFileName = `${fileNameWithoutExt}.webp`;
            const destPath = path.join(RESULT_DIR, destFileName);

            try {
                // Get metadata to verify it's an image and get dimensions if needed (though we just convert)
                await sharp(sourcePath)
                    .webp({ 
                        quality: 90,
                        effort: 6 // Max compression effort for best size/quality ratio
                    }) 
                    .toFile(destPath);

                console.log(`✅ Converted: ${file} -> ${destFileName}`);
            } catch (err) {
                console.error(`❌ Error processing ${file}:`, err.message);
            }
        });

        await Promise.all(promises);
        console.log('\n✨ All conversions completed!');

    } catch (error) {
        console.error('Fatal error:', error);
    }
}

convertImages();
