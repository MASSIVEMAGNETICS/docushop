const { default: pngToIco } = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

async function generateIcoFiles() {
  try {
    // Generate main icon.ico with multiple sizes
    const mainIco = await pngToIco([
      path.join(publicDir, 'icon-16.png'),
      path.join(publicDir, 'icon-24.png'),
      path.join(publicDir, 'icon-32.png'),
      path.join(publicDir, 'icon-48.png'),
      path.join(publicDir, 'icon-64.png'),
      path.join(publicDir, 'icon-128.png'),
      path.join(publicDir, 'icon-256.png')
    ]);
    fs.writeFileSync(path.join(publicDir, 'icon.ico'), mainIco);
    console.log('Generated icon.ico');
    
    // Generate template-icon.ico (same as main for now)
    fs.writeFileSync(path.join(publicDir, 'template-icon.ico'), mainIco);
    console.log('Generated template-icon.ico');
    
    // Generate document-icon.ico (same as main for now)
    fs.writeFileSync(path.join(publicDir, 'document-icon.ico'), mainIco);
    console.log('Generated document-icon.ico');
    
    console.log('All ICO files generated successfully!');
  } catch (error) {
    console.error('Error generating ICO files:', error);
    process.exit(1);
  }
}

generateIcoFiles();
