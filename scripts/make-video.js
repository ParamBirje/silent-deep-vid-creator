import { execSync } from 'child_process';
import path from 'path';
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
    execSync(`npx remotion render AutoVideo out/${videoName}.mp4 src/index.ts`, { stdio: 'inherit', cwd: rootDir });

    console.log(`\nSuccess! Video rendered to out/${videoName}.mp4`);
} catch (error) {
    console.error('Error during video creation:', error.message);
    process.exit(1);
}
