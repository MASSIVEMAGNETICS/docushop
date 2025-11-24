// Preload script for Electron
// This script runs before the renderer process loads
// It can safely expose select Node.js features to the renderer

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  showSaveDialog: (options) => ipcRenderer.send('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.send('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.send('show-message-box', options),
  
  // Dialog responses
  onSaveDialogResult: (callback) => ipcRenderer.on('save-dialog-result', callback),
  onOpenDialogResult: (callback) => ipcRenderer.on('open-dialog-result', callback),
  onMessageBoxResult: (callback) => ipcRenderer.on('message-box-result', callback),
  
  // Menu actions
  onMenuAction: (channel, callback) => {
    const validChannels = [
      'menu-new-template',
      'menu-new-document',
      'menu-open-template',
      'menu-open-document',
      'menu-save',
      'menu-save-as',
      'menu-export-pdf',
      'menu-export-docx',
      'menu-find',
      'menu-replace',
      'menu-insert-text',
      'menu-insert-image',
      'menu-insert-variable',
      'menu-insert-signature',
      'menu-view-dashboard',
      'menu-view-editor',
      'menu-view-creator',
      'menu-zoom-in',
      'menu-zoom-out',
      'menu-zoom-reset',
      'menu-theme-change',
      'menu-language-change',
      'menu-autosave-toggle',
      'menu-autoupdate-toggle',
      'menu-org-settings',
      'menu-user-profile',
      'menu-security-settings',
      'menu-audit-logs',
      'menu-template-library',
      'menu-document-archive',
      'menu-signature-manager',
      'menu-variable-manager',
      'menu-import-templates',
      'menu-export-templates',
      'menu-backup-restore',
      'menu-show-shortcuts',
      'menu-check-updates',
      'menu-clear-recent'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  
  // Remove listeners
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }
});
