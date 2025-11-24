# DocuShop Windows 10 Application - Menu Structure

## Complete Menu Bar Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ File | Edit | View | Preferences | Tools | Help                     │
└─────────────────────────────────────────────────────────────────────┘
```

### File Menu
```
File
├── New Template                    Ctrl+N
├── New Document                    Ctrl+Shift+N
├── ─────────────────────────────────────
├── Open Template...                Ctrl+O
├── Open Document...                Ctrl+Shift+O
├── ─────────────────────────────────────
├── Save                            Ctrl+S
├── Save As...                      Ctrl+Shift+S
├── ─────────────────────────────────────
├── Export as PDF                   Ctrl+E
├── Export as DOCX                  Ctrl+Shift+E
├── ─────────────────────────────────────
├── Print                           Ctrl+P
├── ─────────────────────────────────────
├── Recent Files                    ▶
│   └── Clear Recent Files
├── ─────────────────────────────────────
└── Exit                            Alt+F4
```

### Edit Menu
```
Edit
├── Undo                            Ctrl+Z
├── Redo                            Ctrl+Y
├── ─────────────────────────────────────
├── Cut                             Ctrl+X
├── Copy                            Ctrl+C
├── Paste                           Ctrl+V
├── Select All                      Ctrl+A
├── ─────────────────────────────────────
├── Find                            Ctrl+F
├── Replace                         Ctrl+H
├── ─────────────────────────────────────
└── Insert Element                  ▶
    ├── Text Box                    Ctrl+T
    ├── Image                       Ctrl+I
    ├── Variable                    Ctrl+Shift+V
    └── Signature Field
```

### View Menu
```
View
├── Dashboard                       Ctrl+1
├── Template Editor                 Ctrl+2
├── Document Creator                Ctrl+3
├── ─────────────────────────────────────
├── Zoom In                         Ctrl+Plus
├── Zoom Out                        Ctrl+-
├── Reset Zoom                      Ctrl+0
├── ─────────────────────────────────────
├── Toggle Full Screen              F11
├── Reload                          Ctrl+R
└── Toggle Developer Tools          Ctrl+Shift+I
```

### Preferences Menu
```
Preferences
├── Settings                        Ctrl+,
├── ─────────────────────────────────────
├── Theme                           ▶
│   ├── ○ Light
│   ├── ○ Dark
│   └── ○ Auto
├── Language                        ▶
│   ├── ● English
│   ├── ○ Spanish
│   └── ○ French
├── ─────────────────────────────────────
├── ☑ Auto-Save
├── ☑ Auto-Update
├── ─────────────────────────────────────
├── Organization Settings
├── User Profile                    Ctrl+U
├── ─────────────────────────────────────
├── Security & Privacy
└── Audit Logs
```

### Tools Menu
```
Tools
├── Template Library
├── Document Archive
├── ─────────────────────────────────────
├── Signature Manager
├── Variable Manager
├── ─────────────────────────────────────
├── Import Templates
├── Export Templates
├── ─────────────────────────────────────
└── Backup & Restore
```

### Help Menu
```
Help
├── Documentation
├── API Reference
├── Keyboard Shortcuts              Ctrl+/
├── ─────────────────────────────────────
├── Check for Updates
├── Report Issue
├── ─────────────────────────────────────
├── HIPAA Compliance Information
├── ─────────────────────────────────────
└── About DocuShop
```

## Keyboard Shortcuts Summary

### File Operations
| Action              | Shortcut       |
|---------------------|----------------|
| New Template        | Ctrl+N         |
| New Document        | Ctrl+Shift+N   |
| Open Template       | Ctrl+O         |
| Open Document       | Ctrl+Shift+O   |
| Save                | Ctrl+S         |
| Save As             | Ctrl+Shift+S   |
| Export PDF          | Ctrl+E         |
| Export DOCX         | Ctrl+Shift+E   |
| Print               | Ctrl+P         |
| Exit                | Alt+F4         |

### Editing
| Action              | Shortcut       |
|---------------------|----------------|
| Undo                | Ctrl+Z         |
| Redo                | Ctrl+Y         |
| Cut                 | Ctrl+X         |
| Copy                | Ctrl+C         |
| Paste               | Ctrl+V         |
| Select All          | Ctrl+A         |
| Find                | Ctrl+F         |
| Replace             | Ctrl+H         |
| Insert Text         | Ctrl+T         |
| Insert Image        | Ctrl+I         |
| Insert Variable     | Ctrl+Shift+V   |

### Navigation
| Action              | Shortcut       |
|---------------------|----------------|
| Dashboard           | Ctrl+1         |
| Template Editor     | Ctrl+2         |
| Document Creator    | Ctrl+3         |
| Zoom In             | Ctrl+Plus      |
| Zoom Out            | Ctrl+-         |
| Reset Zoom          | Ctrl+0         |
| Full Screen         | F11            |
| Reload              | Ctrl+R         |
| Developer Tools     | Ctrl+Shift+I   |

### Settings
| Action              | Shortcut       |
|---------------------|----------------|
| Settings            | Ctrl+,         |
| User Profile        | Ctrl+U         |
| Shortcuts Help      | Ctrl+/         |

## Menu Features

### Radio Buttons
- Theme selection (Light/Dark/Auto)
- Language selection (English/Spanish/French)

### Checkboxes
- Auto-Save toggle
- Auto-Update toggle

### Submenus
- Recent Files (dynamic list)
- Insert Element (multiple types)
- Theme options
- Language options

### Dialogs
- About box with version info
- Settings modal window
- File open/save dialogs
- Confirmation dialogs

## Integration with React

The menu system is fully integrated with the React application through:

1. **IPC Communication**: Main process sends events to renderer
2. **React Hook**: `useElectronMenu` handles menu events
3. **Event Handlers**: Each menu action triggers appropriate React state changes
4. **Bidirectional**: Menu state can reflect application state

Example:
```javascript
// Menu click → IPC → React Hook → State Update → UI Change
File > New Template → menu-new-template → onNewTemplate() → setCurrentPage('template-editor')
```

## Windows Integration

### File Associations
- `.dtpl` - DocuShop Template files
- `.ddoc` - DocuShop Document files

Double-clicking these files opens them in DocuShop.

### Installer Features
- Custom installation directory
- Desktop shortcut
- Start Menu entry
- Uninstaller
- License agreement
- Run after install option

### System Integration
- Windows taskbar integration
- System tray support (optional)
- Windows notifications
- File type icons
- Context menu integration (planned)

## Accessibility

All menu items support:
- Keyboard navigation (Alt+F for File menu, etc.)
- Keyboard shortcuts for common actions
- Screen reader compatibility
- High contrast theme support

---

**Version**: 1.0.0  
**Platform**: Windows 10/11  
**Framework**: Electron + React
