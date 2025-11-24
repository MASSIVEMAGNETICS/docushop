# DocuShop Electron Desktop Application - Developer Guide

## Overview

This guide explains how to build, develop, and package DocuShop as a native Windows 10 desktop application using Electron.

## Prerequisites

- Node.js 20+ and npm
- Windows 10 or later (for Windows builds)
- Python 3.12+ (for backend development)

## Project Structure

```
frontend/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script for security
├── src/                 # React application source
├── public/              # Static assets and icons
├── dist/                # Vite build output
├── dist-electron/       # Electron build output
├── build/               # Build resources
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── generate-*.js        # Icon generation scripts
```

## Development

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Development Mode

Run the Electron app in development mode with hot-reload:

```bash
npm run electron:dev
```

This will:
- Start the Vite dev server on port 5173 (changed from 3000 for Vite compatibility)
- Launch Electron with DevTools open
- Enable hot-reload for both React and Electron

**Note**: The development server port changed from 3000 to 5173 to align with Vite's default configuration.

### 3. Web Development Mode

To develop just the web interface without Electron:

```bash
npm run dev
```

Access at http://localhost:5173

## Building

### Build for Current Platform

```bash
npm run electron:build
```

### Build for Windows Only

```bash
npm run electron:build:win
```

This generates:
- `DocuShop-Setup-1.0.0.exe` - Windows installer (NSIS)
- `DocuShop-Portable-1.0.0.exe` - Portable version

### Build for All Platforms

```bash
npm run electron:build:all
```

Generates installers for:
- Windows (NSIS installer + Portable)
- macOS (DMG + ZIP)
- Linux (AppImage + DEB)

## Application Menu

DocuShop includes a comprehensive Windows-style menu bar:

### File Menu
- New Template / Document
- Open Template / Document
- Save / Save As
- Export (PDF/DOCX)
- Print
- Recent Files
- Exit

### Edit Menu
- Undo / Redo
- Cut / Copy / Paste / Select All
- Find / Replace
- Insert Element (Text, Image, Variable, Signature)

### View Menu
- Dashboard / Template Editor / Document Creator
- Zoom In / Out / Reset
- Toggle Full Screen
- Reload
- Developer Tools

### Preferences Menu
- Settings
- Theme (Light/Dark/Auto)
- Language (English/Spanish/French)
- Auto-Save / Auto-Update toggles
- Organization Settings
- User Profile
- Security & Privacy
- Audit Logs

### Tools Menu
- Template Library
- Document Archive
- Signature Manager
- Variable Manager
- Import/Export Templates
- Backup & Restore

### Help Menu
- Documentation
- API Reference
- Keyboard Shortcuts
- Check for Updates
- Report Issue
- HIPAA Compliance Info
- About DocuShop

## Icon Generation

Icons are generated from `public/icon.svg`:

```bash
# Generate PNG icons (various sizes)
node generate-icons.js

# Generate ICO files for Windows
node generate-ico.js
```

Generated files:
- `icon.png` - Main PNG icon (256x256)
- `icon-{16,24,32,48,64,128,256,512}.png` - Various sizes
- `icon.ico` - Windows icon
- `template-icon.ico` - Template file association
- `document-icon.ico` - Document file association

## Security

Security features implemented:
- **Context Isolation**: Enabled to prevent renderer process from accessing Node.js
- **Preload Script**: Controlled IPC access via contextBridge
- **Node Integration**: Disabled in renderer processes
- **Sandbox**: Enabled for additional security layer
- **Content Security Policy**: Ready for production deployment
- **No Remote Module**: All communication via secure IPC

### Security Best Practices

The application follows Electron security best practices:

1. **Isolated Contexts**: Renderer processes cannot directly access Node.js APIs
2. **Controlled IPC**: Only whitelisted channels can communicate between processes
3. **Secure Loading**: HTTPS enforced in production, localhost allowed in dev
4. **Input Validation**: All IPC messages should be validated (implement in handlers)

For production deployment:
- Enable CSP headers
- Implement input validation for all IPC messages
- Use signed code for Windows distribution
- Regular security audits and updates

## Configuration

### package.json

Key Electron configurations:
- `main`: Entry point for Electron main process
- `build`: electron-builder configuration
  - `appId`: Application identifier
  - `win`: Windows-specific settings
  - `nsis`: NSIS installer configuration
  - `portable`: Portable app configuration

### Installer Settings

NSIS installer features:
- Custom installation directory
- Desktop shortcut creation
- Start menu shortcuts
- File associations (.dtpl, .ddoc)
- Uninstaller
- Run after finish option

## File Associations

DocuShop registers these file types:

- `.dtpl` - DocuShop Template files
- `.ddoc` - DocuShop Document files

Double-clicking these files will open them in DocuShop.

## Auto-Updates

Auto-update configuration (requires GitHub releases):

```json
"publish": {
  "provider": "github",
  "owner": "MASSIVEMAGNETICS",
  "repo": "docushop"
}
```

To enable auto-updates:
1. Create GitHub releases
2. Attach build artifacts
3. Update version in package.json
4. Rebuild and release

## IPC Communication

Electron uses IPC (Inter-Process Communication) for renderer ↔ main communication:

### From Renderer to Main:
```javascript
window.electronAPI.showSaveDialog(options);
```

### From Main to Renderer:
```javascript
mainWindow.webContents.send('menu-save');
```

### Listening in Renderer:
```javascript
window.electronAPI.onMenuAction('menu-save', () => {
  // Handle save action
});
```

## Security

Security features implemented:
- Context isolation enabled
- Preload script for controlled Node.js access
- Content Security Policy ready
- No remote module in production
- Sandboxing available

## Debugging

### Enable DevTools

In development, DevTools open automatically. To toggle:
- Menu: View → Toggle Developer Tools
- Keyboard: Ctrl+Shift+I

### View Main Process Logs

Run Electron from terminal to see main process logs:
```bash
npm run electron
```

### Debug Main Process

Add to main.js:
```javascript
require('electron-debug')({showDevTools: true});
```

## Testing

### Test in Development
```bash
npm run electron:dev
```

### Test Production Build
```bash
npm run build
npm run electron
```

### Test Installer
```bash
npm run electron:build:win
# Install and test the generated .exe
```

## Performance Optimization

Features enabled:
- GPU rasterization
- Zero-copy rendering
- Code splitting (vendor, konva chunks)
- Asset optimization via Vite

## Distribution

### Release Checklist

1. Update version in `package.json`
2. Update `WINDOWS_INSTALLATION.md` if needed
3. Build for all platforms: `npm run electron:build:all`
4. Test installers on clean machines
5. Create GitHub release
6. Upload build artifacts
7. Update release notes

### Build Artifacts Location

After building, find artifacts in:
```
frontend/dist-electron/
├── DocuShop-Setup-1.0.0.exe          # Windows installer
├── DocuShop-Portable-1.0.0.exe       # Windows portable
├── DocuShop-1.0.0.dmg                # macOS installer
├── DocuShop-1.0.0.AppImage           # Linux AppImage
└── DocuShop_1.0.0_amd64.deb          # Debian package
```

## Troubleshooting

### Build Fails

1. Clear cache:
   ```bash
   rm -rf node_modules dist dist-electron
   npm install
   ```

2. Update dependencies:
   ```bash
   npm update
   ```

### Icons Not Showing

Regenerate icons:
```bash
node generate-icons.js
node generate-ico.js
```

### Menu Not Working

Check IPC handlers in:
- `electron/main.js` - Send events
- `electron/preload.js` - Expose to renderer
- React components - Listen for events

### DevTools Not Opening

Set in main.js:
```javascript
mainWindow.webContents.openDevTools({ mode: 'detach' });
```

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Support

For issues or questions:
- GitHub Issues: https://github.com/MASSIVEMAGNETICS/docushop/issues
- Documentation: See README.md and docs/

---

**Last Updated**: November 2024  
**Version**: 1.0.0
