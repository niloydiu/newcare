const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const assetsDir = path.resolve(__dirname, "../frontend/src/assets/assets_frontend");

async function uploadAll() {
  if (!fs.existsSync(assetsDir)) {
    console.error(`Assets directory does not exist: ${assetsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir);
  const mapping = {};

  console.log(`Found ${files.length} assets to upload to Cloudinary...`);

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".svg"].includes(ext)) {
        console.log(`Uploading ${file}...`);
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "newcare_assets",
            use_filename: true,
            unique_filename: false,
            resource_type: "auto",
          });
          mapping[file] = result.secure_url;
          console.log(`Uploaded ${file} -> ${result.secure_url}`);
        } catch (err) {
          console.error(`Failed to upload ${file}:`, err.message);
        }
      }
    }
  }

  const outputPath = path.resolve(__dirname, "cloudinary_mapping.json");
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`Saved mapping to ${outputPath}`);
}

uploadAll();
