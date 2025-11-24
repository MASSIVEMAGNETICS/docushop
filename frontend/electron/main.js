const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let preferencesWindow;

// Enable GPU acceleration for better performance on Windows 10
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      sandbox: true
    },
    frame: true,
    titleBarStyle: 'default',
    autoHideMenuBar: false,
    show: false
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready to avoid flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create the application menu
  createApplicationMenu();
}

function createApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Template',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-template');
          }
        },
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            mainWindow.webContents.send('menu-new-document');
          }
        },
        { type: 'separator' },
        {
          label: 'Open Template...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open-template');
          }
        },
        {
          label: 'Open Document...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => {
            mainWindow.webContents.send('menu-open-document');
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu-save-as');
          }
        },
        { type: 'separator' },
        {
          label: 'Export as PDF',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-export-pdf');
          }
        },
        {
          label: 'Export as DOCX',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => {
            mainWindow.webContents.send('menu-export-docx');
          }
        },
        { type: 'separator' },
        {
          label: 'Print',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.print();
          }
        },
        { type: 'separator' },
        {
          label: 'Recent Files',
          submenu: [
            {
              label: 'Clear Recent Files',
              click: () => {
                mainWindow.webContents.send('menu-clear-recent');
              }
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow.webContents.send('menu-find');
          }
        },
        {
          label: 'Replace',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.send('menu-replace');
          }
        },
        { type: 'separator' },
        {
          label: 'Insert Element',
          submenu: [
            {
              label: 'Text Box',
              accelerator: 'CmdOrCtrl+T',
              click: () => {
                mainWindow.webContents.send('menu-insert-text');
              }
            },
            {
              label: 'Image',
              accelerator: 'CmdOrCtrl+I',
              click: () => {
                mainWindow.webContents.send('menu-insert-image');
              }
            },
            {
              label: 'Variable',
              accelerator: 'CmdOrCtrl+Shift+V',
              click: () => {
                mainWindow.webContents.send('menu-insert-variable');
              }
            },
            {
              label: 'Signature Field',
              click: () => {
                mainWindow.webContents.send('menu-insert-signature');
              }
            }
          ]
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            mainWindow.webContents.send('menu-view-dashboard');
          }
        },
        {
          label: 'Template Editor',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            mainWindow.webContents.send('menu-view-editor');
          }
        },
        {
          label: 'Document Creator',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            mainWindow.webContents.send('menu-view-creator');
          }
        },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            mainWindow.webContents.send('menu-zoom-in');
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            mainWindow.webContents.send('menu-zoom-out');
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.send('menu-zoom-reset');
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: 'F11',
          role: 'togglefullscreen'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload'
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools'
        }
      ]
    },
    {
      label: 'Preferences',
      submenu: [
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            createPreferencesWindow();
          }
        },
        { type: 'separator' },
        {
          label: 'Theme',
          submenu: [
            {
              label: 'Light',
              type: 'radio',
              checked: true,
              click: () => {
                mainWindow.webContents.send('menu-theme-change', 'light');
              }
            },
            {
              label: 'Dark',
              type: 'radio',
              click: () => {
                mainWindow.webContents.send('menu-theme-change', 'dark');
              }
            },
            {
              label: 'Auto',
              type: 'radio',
              click: () => {
                mainWindow.webContents.send('menu-theme-change', 'auto');
              }
            }
          ]
        },
        {
          label: 'Language',
          submenu: [
            {
              label: 'English',
              type: 'radio',
              checked: true,
              click: () => {
                mainWindow.webContents.send('menu-language-change', 'en');
              }
            },
            {
              label: 'Spanish',
              type: 'radio',
              click: () => {
                mainWindow.webContents.send('menu-language-change', 'es');
              }
            },
            {
              label: 'French',
              type: 'radio',
              click: () => {
                mainWindow.webContents.send('menu-language-change', 'fr');
              }
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Auto-Save',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            mainWindow.webContents.send('menu-autosave-toggle', menuItem.checked);
          }
        },
        {
          label: 'Auto-Update',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            mainWindow.webContents.send('menu-autoupdate-toggle', menuItem.checked);
          }
        },
        { type: 'separator' },
        {
          label: 'Organization Settings',
          click: () => {
            mainWindow.webContents.send('menu-org-settings');
          }
        },
        {
          label: 'User Profile',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            mainWindow.webContents.send('menu-user-profile');
          }
        },
        { type: 'separator' },
        {
          label: 'Security & Privacy',
          click: () => {
            mainWindow.webContents.send('menu-security-settings');
          }
        },
        {
          label: 'Audit Logs',
          click: () => {
            mainWindow.webContents.send('menu-audit-logs');
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Template Library',
          click: () => {
            mainWindow.webContents.send('menu-template-library');
          }
        },
        {
          label: 'Document Archive',
          click: () => {
            mainWindow.webContents.send('menu-document-archive');
          }
        },
        { type: 'separator' },
        {
          label: 'Signature Manager',
          click: () => {
            mainWindow.webContents.send('menu-signature-manager');
          }
        },
        {
          label: 'Variable Manager',
          click: () => {
            mainWindow.webContents.send('menu-variable-manager');
          }
        },
        { type: 'separator' },
        {
          label: 'Import Templates',
          click: () => {
            mainWindow.webContents.send('menu-import-templates');
          }
        },
        {
          label: 'Export Templates',
          click: () => {
            mainWindow.webContents.send('menu-export-templates');
          }
        },
        { type: 'separator' },
        {
          label: 'Backup & Restore',
          click: () => {
            mainWindow.webContents.send('menu-backup-restore');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/MASSIVEMAGNETICS/docushop/blob/main/README.md');
          }
        },
        {
          label: 'API Reference',
          click: () => {
            shell.openExternal('https://github.com/MASSIVEMAGNETICS/docushop/blob/main/docs/API.md');
          }
        },
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => {
            mainWindow.webContents.send('menu-show-shortcuts');
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            mainWindow.webContents.send('menu-check-updates');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/MASSIVEMAGNETICS/docushop/issues/new');
          }
        },
        { type: 'separator' },
        {
          label: 'HIPAA Compliance Information',
          click: () => {
            shell.openExternal('https://github.com/MASSIVEMAGNETICS/docushop/blob/main/docs/HIPAA_CHECKLIST.md');
          }
        },
        { type: 'separator' },
        {
          label: 'About DocuShop',
          click: () => {
            showAboutDialog();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createPreferencesWindow() {
  if (preferencesWindow) {
    preferencesWindow.focus();
    return;
  }

  preferencesWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    parent: mainWindow,
    modal: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: true,
    autoHideMenuBar: true,
    title: 'Preferences'
  });

  const preferencesUrl = isDev
    ? 'http://localhost:5173/#/preferences'
    : `file://${path.join(__dirname, '../dist/index.html#/preferences')}`;

  preferencesWindow.loadURL(preferencesUrl);

  preferencesWindow.on('closed', () => {
    preferencesWindow = null;
  });
}

function showAboutDialog() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About DocuShop',
    message: 'DocuShop',
    detail: 'Version: 1.0.0\n\nA HIPAA-compliant document composition platform for clinical use.\n\nCopyright © 2024 MASSIVE MAGNETICS\nAll rights reserved.',
    buttons: ['OK'],
    icon: path.join(__dirname, '../public/icon.png')
  });
}

// IPC handlers for communication between main and renderer processes
ipcMain.on('show-save-dialog', (event, options) => {
  dialog.showSaveDialog(mainWindow, options).then(result => {
    event.reply('save-dialog-result', result);
  });
});

ipcMain.on('show-open-dialog', (event, options) => {
  dialog.showOpenDialog(mainWindow, options).then(result => {
    event.reply('open-dialog-result', result);
  });
});

ipcMain.on('show-message-box', (event, options) => {
  dialog.showMessageBox(mainWindow, options).then(result => {
    event.reply('message-box-result', result);
  });
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle certificate errors in development
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});
