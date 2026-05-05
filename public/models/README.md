# 3D Models for AR Menu Viewer

This folder contains 3D models (.glb and .usdz files) for the AR menu viewer feature.

## File Naming Convention

Models should be named using the menu item name in lowercase with hyphens:
- **Menu Item**: "Boerewors Roll" → **File**: `boerewors-roll.glb`
- **Menu Item**: "Chicken Burger" → **File**: `chicken-burger.glb`
- **Menu Item**: "Pap & Vleis" → **File**: `pap-vleis.glb`

## File Formats

### For Android/Web (Required)
- **Format**: `.glb` (Binary glTF)
- **Max Size**: 5MB recommended
- **Optimization**: Use compressed textures

### For iOS AR (Optional)
- **Format**: `.usdz` (Universal Scene Description)
- **Same filename** as .glb but with .usdz extension
- Example: `boerewors-roll.usdz`

## Where to Get 3D Models

### Free Sources
1. **Sketchfab** - https://sketchfab.com/feed
   - Search for food models
   - Download in glTF format
   - Filter by "Downloadable"

2. **Poly Pizza** - https://poly.pizza
   - Free 3D models
   - Good food collection

3. **TurboSquid Free** - https://www.turbosquid.com/Search/3D-Models/free/food
   - Free food models
   - Convert to .glb format

### AI Generation
1. **Meshy.ai** - https://www.meshy.ai
   - Generate 3D models from text/images
   - Export as .glb

2. **Spline AI** - https://spline.design
   - Create 3D food models
   - Export as .glb

## Model Requirements

### Technical Specs
- **Polygons**: 5,000 - 50,000 triangles
- **Textures**: 1024x1024 or 2048x2048 max
- **Format**: glTF 2.0 (.glb)
- **Scale**: Real-world size (e.g., burger ~10cm diameter)

### Best Practices
- Center the model at origin (0,0,0)
- Face the model towards +Z axis
- Include PBR materials (metallic/roughness)
- Bake lighting if possible
- Test on mobile devices

## Converting Models

### Using Blender (Free)
1. Import your model (File → Import)
2. Scale to real-world size
3. Center at origin
4. Export as glTF 2.0 (.glb)
   - File → Export → glTF 2.0
   - Format: glTF Binary (.glb)
   - Include: Normals, UVs, Materials

### Online Converters
- **glTF Viewer** - https://gltf-viewer.donmccurdy.com
- **Blender Online** - https://www.blender.org/download

## Fallback Behavior

If a 3D model is not found:
1. System tries to load: `/models/{item-name}.glb`
2. If fails, tries: `/models/default-plate.glb`
3. If fails, shows the product image instead
4. User sees "3D model not available" message

## Creating a Default Plate Model

You can create a simple default plate model:
1. Use Blender to create a basic plate/dish
2. Add a simple texture
3. Export as `default-plate.glb`
4. This will be used as fallback for all items

## Testing

1. Add your .glb file to this folder
2. Refresh the menu page
3. Click the "🥽 3D" button on any menu item
4. Test on both desktop and mobile
5. Test AR mode on mobile devices

## Example Structure

```
public/models/
├── README.md
├── default-plate.glb
├── boerewors-roll.glb
├── boerewors-roll.usdz
├── chicken-burger.glb
├── chicken-burger.usdz
├── pap-vleis.glb
└── malva-pudding.glb
```

## Support

For issues or questions about 3D models:
- Check model-viewer documentation: https://modelviewer.dev
- Validate .glb files: https://gltf-validator.donmccurdy.com
