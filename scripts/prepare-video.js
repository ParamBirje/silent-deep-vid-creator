import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoName = process.argv[2];

if (!videoName) {
    console.error('Please provide a video name (folder name in mats)');
    process.exit(1);
}

const matsDir = path.resolve(__dirname, '../public/mats', videoName);

if (!fs.existsSync(matsDir)) {
    console.error(`Directory not found: ${matsDir}`);
    process.exit(1);
}

function getAudioDuration(filePath) {
    try {
        const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString();
        return parseFloat(output);
    } catch (e) {
        console.error(`Error getting duration for ${filePath}:`, e);
        return 0;
    }
}

function parseScriptForTitles(scriptPath) {
    if (!fs.existsSync(scriptPath)) return {};
    const content = fs.readFileSync(scriptPath, 'utf8');
    const titles = {};
    const lines = content.split('\n');
    let sectionIndex = 0;

    for (const line of lines) {
        if (line.startsWith('### ')) {
            const title = line.replace('### ', '').trim();
            // We'll map them by index since folders are 0-hook, 1-section
            titles[sectionIndex] = title;
            sectionIndex++;
        }
    }
    return titles;
}

const scriptPath = path.join(matsDir, 'script.md');
const sectionTitles = parseScriptForTitles(scriptPath);

const contents = fs.readdirSync(matsDir, { withFileTypes: true });
const sectionDirs = contents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort((a, b) => {
        const aNum = parseInt(a.split('-')[0]) || 0;
        const bNum = parseInt(b.split('-')[0]) || 0;
        return aNum - bNum;
    });

const sections = [];

sectionDirs.forEach((dirName, index) => {
    const dirPath = path.join(matsDir, dirName);
    const files = fs.readdirSync(dirPath);

    const audioFile = files.find(f => f.endsWith('.wav') || f.endsWith('.mp3'));
    const imageFiles = files.filter(f => f.match(/\.(jpeg|jpg|png|webp|jfif)$/i)).sort();

    if (!audioFile) {
        console.warn(`No audio file found in ${dirName}, skipping section.`);
        return;
    }

    const audioPath = path.join('mats', videoName, dirName, audioFile).replace(/\\/g, '/');
    const duration = getAudioDuration(path.join(dirPath, audioFile));

    const imageDuration = duration / imageFiles.length;

    const sectionImages = imageFiles.map(img => ({
        path: path.join('mats', videoName, dirName, img).replace(/\\/g, '/'),
        durationInSeconds: imageDuration
    }));

    sections.push({
        title: sectionTitles[index] || dirName.split('-').slice(1).join(' ').toUpperCase() || 'UNTITLED',
        audioPath,
        durationInSeconds: duration,
        images: sectionImages
    });
});

const metadata = {
    videoName,
    sections
};

fs.writeFileSync(path.resolve(__dirname, '../src/metadata.json'), JSON.stringify(metadata, null, 2));
console.log('Metadata generated successfully in src/metadata.json');
