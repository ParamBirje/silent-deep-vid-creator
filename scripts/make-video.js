import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoName = process.argv[2];

if (!videoName) {
    console.error('Please provide a video name (folder name in mats)');
    process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');

try {
    console.log(`Step 1: Preparing metadata for ${videoName}...`);
    execSync(`node scripts/prepare-video.js ${videoName}`, { stdio: 'inherit', cwd: rootDir });

    console.log(`Step 2: Rendering video...`);
    // Note: We use the generated metadata.json which is read by Root.tsx

    // Parse CRF from config.ts since we can't easily import TS in this Node script
    const configPath = path.join(rootDir, 'src/config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const crfMatch = configContent.match(/CRF:\s*(\d+)/);
    const crf = crfMatch ? crfMatch[1] : 23;

    console.log(`Using CRF: ${crf}`);
    execSync(`npx remotion render AutoVideo out/${videoName}.mp4 src/index.ts --crf=${crf}`, { stdio: 'inherit', cwd: rootDir });

    console.log(`\nSuccess! Video rendered to out/${videoName}.mp4`);
} catch (error) {
    console.error('Error during video creation:', error.message);
    process.exit(1);
}
