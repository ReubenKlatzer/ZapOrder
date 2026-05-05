/**
 * Download Test 3D Model
 * 
 * This script downloads a free test model to verify the 3D viewer works
 * Run: node public/models/download-test-model.mjs
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

console.log('🔽 Downloading test 3D model...\n');

// Using a free model from model-viewer examples
const testModelUrl = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Burger/glTF-Binary/Burger.glb';

fetch(testModelUrl)
	.then(response => {
		if (!response.ok) throw new Error('Download failed');
		return response.arrayBuffer();
	})
	.then(buffer => {
		const filePath = join(process.cwd(), 'public', 'models', 'test-burger.glb');
		writeFileSync(filePath, Buffer.from(buffer));
		console.log('✅ Test model downloaded successfully!');
		console.log('📁 Saved to: public/models/test-burger.glb');
		console.log('\n🎯 To test:');
		console.log('1. Refresh your menu page');
		console.log('2. Find any burger item');
		console.log('3. Rename test-burger.glb to match the item name');
		console.log('   Example: classic-beef-burger.glb');
		console.log('\n💡 Or just test with "Test Burger" menu item!');
	})
	.catch(error => {
		console.error('❌ Download failed:', error.message);
		console.log('\n📝 Manual download:');
		console.log('1. Go to: https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Burger/glTF-Binary/Burger.glb');
		console.log('2. Save as: test-burger.glb');
		console.log('3. Move to: public/models/');
	});
