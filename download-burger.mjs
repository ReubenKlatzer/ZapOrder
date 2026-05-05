import { writeFileSync } from 'fs';
import { join } from 'path';
import https from 'https';

console.log('🔽 Downloading burger 3D model...\n');

const url = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Burger/glTF-Binary/Burger.glb';
const filePath = join(process.cwd(), 'public', 'models', 'classic-beef-burger.glb');

https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
            const chunks = [];
            redirectResponse.on('data', (chunk) => chunks.push(chunk));
            redirectResponse.on('end', () => {
                const buffer = Buffer.concat(chunks);
                writeFileSync(filePath, buffer);
                console.log('✅ Model downloaded successfully!');
                console.log('📁 Saved to:', filePath);
                console.log('📊 Size:', buffer.length, 'bytes');
            });
        });
    } else {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            writeFileSync(filePath, buffer);
            console.log('✅ Model downloaded successfully!');
            console.log('📁 Saved to:', filePath);
            console.log('📊 Size:', buffer.length, 'bytes');
        });
    }
}).on('error', (err) => {
    console.error('❌ Download failed:', err.message);
});
