# DocuShop - Windows 10 Desktop Application

## Installation Guide

### System Requirements
- **Operating System**: Windows 10 (64-bit) or later
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB for installation
- **Display**: 1024x768 minimum resolution (1920x1080 recommended)

### Installation Steps

1. **Download the Installer**
   - Download `DocuShop-Setup-1.0.0.exe` from the releases page
   - Or use the portable version: `DocuShop-Portable-1.0.0.exe`

2. **Run the Installer**
   - Double-click the downloaded `.exe` file
   - If Windows SmartScreen appears, click "More info" then "Run anyway"
   - Follow the installation wizard

3. **Choose Installation Location**
   - Default: `C:\Program Files\DocuShop`
   - Or choose a custom location

4. **Complete Installation**
   - The installer will create desktop and start menu shortcuts
   - Click "Finish" to launch DocuShop

### First Run

When you launch DocuShop for the first time:

1. The application will open with the Dashboard view
2. Configure your backend API endpoint in Preferences → Settings
3. Log in with your credentials
4. Start creating templates and documents!

### Features

DocuShop for Windows includes:

- **File Menu**: Create, open, save templates and documents; export to PDF/DOCX; print
- **Edit Menu**: Full editing capabilities with undo/redo, cut/copy/paste
- **View Menu**: Navigate between Dashboard, Template Editor, and Document Creator
- **Preferences Menu**: Customize settings, themes, language, and user preferences
- **Tools Menu**: Access template library, signature manager, backup/restore
- **Help Menu**: Documentation, keyboard shortcuts, and support

### Keyboard Shortcuts

#### File Operations
- `Ctrl+N` - New Template
- `Ctrl+Shift+N` - New Document
- `Ctrl+O` - Open Template
- `Ctrl+S` - Save
- `Ctrl+Shift+S` - Save As
- `Ctrl+E` - Export as PDF
- `Ctrl+P` - Print

#### Editing
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+X` - Cut
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+A` - Select All
- `Ctrl+F` - Find
- `Ctrl+H` - Replace

#### View Navigation
- `Ctrl+1` - Dashboard
- `Ctrl+2` - Template Editor
- `Ctrl+3` - Document Creator
- `Ctrl+Plus` - Zoom In
- `Ctrl+Minus` - Zoom Out
- `Ctrl+0` - Reset Zoom
- `F11` - Toggle Full Screen

#### Settings
- `Ctrl+,` - Open Settings
- `Ctrl+U` - User Profile
- `Ctrl+/` - Show Keyboard Shortcuts

### Auto-Updates

DocuShop automatically checks for updates when launched. When a new version is available:

1. You'll see a notification
2. Click "Download Update"
3. The update will download in the background
4. Restart the application to apply the update

You can disable auto-updates in Preferences → Settings → Auto-Update.

### Portable Version

The portable version doesn't require installation:

1. Extract `DocuShop-Portable-1.0.0.exe` to any folder
2. Run the executable
3. All settings and data are stored in the application folder
4. Perfect for USB drives or shared computers

### Uninstallation

To uninstall DocuShop:

1. Open Windows Settings → Apps
2. Find "DocuShop" in the list
3. Click "Uninstall"
4. Follow the uninstallation wizard

Or use the uninstaller:
- Start Menu → DocuShop → Uninstall DocuShop

### Troubleshooting

#### Application Won't Start
- Ensure you have administrator privileges
- Check Windows Event Viewer for error details
- Try reinstalling the application

#### Can't Connect to Backend
- Verify the API endpoint in Preferences → Settings
- Check your internet connection
- Ensure the backend server is running
- Check firewall settings

#### Display Issues
- Update your graphics drivers
- Try disabling hardware acceleration in Settings
- Adjust display scaling in Windows settings

### Data Location

Application data is stored in:
```
%APPDATA%\DocuShop
```

This includes:
- User preferences
- Recent files
- Application cache
- Logs

### HIPAA Compliance

DocuShop is designed with HIPAA compliance in mind:

- All data transmission uses TLS encryption
- Local data can be encrypted
- Comprehensive audit logging
- Secure signature support

**Important**: Ensure your organization's IT policies and procedures are followed for HIPAA compliance.

### Support

For technical support:
- Documentation: https://github.com/MASSIVEMAGNETICS/docushop
- Report Issues: https://github.com/MASSIVEMAGNETICS/docushop/issues
- Email: support@massivemagnetics.com

### License

Copyright © 2024 MASSIVE MAGNETICS. All rights reserved.
See LICENSE.txt for full license details.

---

**Version**: 1.0.0  
**Last Updated**: November 2024
