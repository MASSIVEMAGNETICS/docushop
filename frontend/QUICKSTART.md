# DocuShop Windows 10 Desktop Application - Quick Start

## For End Users

### Installation

1. **Download** the installer:
   - `DocuShop-Setup-1.0.0.exe` (recommended) - Full installer with shortcuts
   - `DocuShop-Portable-1.0.0.exe` - Portable version (no installation needed)

2. **Run** the installer:
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard
   - Choose installation directory (default: `C:\Program Files\DocuShop`)

3. **Launch** DocuShop:
   - From Desktop shortcut
   - From Start Menu → DocuShop
   - Or from installation directory

### Features

DocuShop for Windows includes:
- **Native Windows menu bar** (File, Edit, View, Preferences, Tools, Help)
- **Keyboard shortcuts** (Ctrl+N, Ctrl+S, Ctrl+Z, etc.)
- **Professional installer** with shortcuts and file associations
- **Auto-update** functionality
- **Offline capable** (local storage)

See [WINDOWS_INSTALLATION.md](WINDOWS_INSTALLATION.md) for complete user documentation.

---

## For Developers

### Prerequisites

```bash
# Required
Node.js 20+
npm 10+

# Optional (for backend)
Python 3.12+
MongoDB
```

### Quick Development Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run in development mode (with Electron)
npm run electron:dev

# This will:
# - Start Vite dev server on port 5173
# - Launch Electron with hot-reload
# - Open DevTools automatically
```

### Development Scripts

```bash
# Web-only development (no Electron)
npm run dev

# Build React app
npm run build

# Run Electron (requires built app)
npm run electron

# Package for current platform (fast, for testing)
npm run pack

# Build Windows installer (slow, for distribution)
npm run electron:build:win

# Build for all platforms
npm run electron:build:all
```

### Project Structure

```
frontend/
├── electron/          # Electron main process
│   ├── main.js       # Main process entry point
│   └── preload.js    # Security preload script
├── src/              # React application
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   └── App.jsx       # Main app component
├── public/           # Static assets & icons
└── dist/             # Vite build output
```

### Building for Windows

**Option 1: Automated Build**
```bash
./build-windows.sh
```

**Option 2: Manual Build**
```bash
# Generate icons
node generate-icons.js
node generate-ico.js

# Build React app
npm run build

# Build Windows installer
npm run electron:build:win
```

### Output

Built installers appear in:
```
dist-electron/
├── DocuShop-Setup-1.0.0.exe      # NSIS installer
└── DocuShop-Portable-1.0.0.exe   # Portable version
```

### Testing

```bash
# 1. Package for testing (fast)
npm run pack

# 2. Run the packaged app
./dist-electron/linux-unpacked/docushop

# 3. For Windows testing, use actual .exe on Windows machine
```

### Menu Integration

The app uses a custom React hook for Electron menu integration:

```javascript
import useElectronMenu from './hooks/useElectronMenu';

// In your component
useElectronMenu({
  onNewTemplate: () => { /* handler */ },
  onSave: () => { /* handler */ },
  // ... more handlers
});
```

Available menu events:
- File: new, open, save, export, print
- Edit: undo, redo, cut, copy, paste, find, replace
- View: dashboard, editor, creator, zoom
- Preferences: theme, language, settings
- Tools: library, archive, backup
- Help: docs, shortcuts, updates

### Debugging

**Development Mode:**
- DevTools open automatically
- Console logs visible
- Hot-reload enabled

**Production Build:**
```bash
# Enable DevTools in production
# In electron/main.js, uncomment:
# mainWindow.webContents.openDevTools();
```

### Common Issues

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist dist-electron
npm install
```

**Icons not showing:**
```bash
# Regenerate icons
node generate-icons.js
node generate-ico.js
```

**Menu not working:**
- Check browser console for errors
- Verify `window.electronAPI` exists
- Check preload script is loaded

### Configuration

**Application Settings** (`package.json`):
- `name`: Package name
- `productName`: Display name
- `version`: App version
- `build`: Electron Builder config

**Windows Installer** (`package.json` → `build.nsis`):
- Installation directory
- Shortcuts
- File associations
- License agreement

### Distribution Checklist

Before releasing:
- [ ] Update version in `package.json`
- [ ] Update `WINDOWS_INSTALLATION.md`
- [ ] Build for Windows: `npm run electron:build:win`
- [ ] Test installer on clean Windows 10 machine
- [ ] Create GitHub release
- [ ] Upload `.exe` files
- [ ] Update release notes
- [ ] Test auto-update (if configured)

### Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [electron-builder Docs](https://www.electron.build/)
- [React Docs](https://react.dev/)

### Support

- Documentation: [README.md](../README.md)
- Developer Guide: [ELECTRON_README.md](ELECTRON_README.md)
- User Guide: [WINDOWS_INSTALLATION.md](WINDOWS_INSTALLATION.md)
- Issues: [GitHub Issues](https://github.com/MASSIVEMAGNETICS/docushop/issues)

---

**Last Updated:** November 2024  
**Version:** 1.0.0
