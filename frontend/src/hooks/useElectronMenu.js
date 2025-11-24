import { useEffect } from 'react';

/**
 * Custom hook to handle Electron menu events
 * @param {Object} handlers - Object containing menu event handlers
 */
export const useElectronMenu = (handlers = {}) => {
  useEffect(() => {
    // Check if running in Electron
    const isElectron = window.electronAPI !== undefined;
    
    if (!isElectron) {
      return;
    }

    // Define menu event handlers with their corresponding actions
    const menuHandlers = {
      // File menu
      'menu-new-template': handlers.onNewTemplate || (() => console.log('New Template')),
      'menu-new-document': handlers.onNewDocument || (() => console.log('New Document')),
      'menu-open-template': handlers.onOpenTemplate || (() => console.log('Open Template')),
      'menu-open-document': handlers.onOpenDocument || (() => console.log('Open Document')),
      'menu-save': handlers.onSave || (() => console.log('Save')),
      'menu-save-as': handlers.onSaveAs || (() => console.log('Save As')),
      'menu-export-pdf': handlers.onExportPdf || (() => console.log('Export PDF')),
      'menu-export-docx': handlers.onExportDocx || (() => console.log('Export DOCX')),
      'menu-clear-recent': handlers.onClearRecent || (() => console.log('Clear Recent')),
      
      // Edit menu
      'menu-find': handlers.onFind || (() => console.log('Find')),
      'menu-replace': handlers.onReplace || (() => console.log('Replace')),
      'menu-insert-text': handlers.onInsertText || (() => console.log('Insert Text')),
      'menu-insert-image': handlers.onInsertImage || (() => console.log('Insert Image')),
      'menu-insert-variable': handlers.onInsertVariable || (() => console.log('Insert Variable')),
      'menu-insert-signature': handlers.onInsertSignature || (() => console.log('Insert Signature')),
      
      // View menu
      'menu-view-dashboard': handlers.onViewDashboard || (() => console.log('View Dashboard')),
      'menu-view-editor': handlers.onViewEditor || (() => console.log('View Editor')),
      'menu-view-creator': handlers.onViewCreator || (() => console.log('View Creator')),
      'menu-zoom-in': handlers.onZoomIn || (() => console.log('Zoom In')),
      'menu-zoom-out': handlers.onZoomOut || (() => console.log('Zoom Out')),
      'menu-zoom-reset': handlers.onZoomReset || (() => console.log('Zoom Reset')),
      
      // Preferences menu
      'menu-theme-change': handlers.onThemeChange || ((theme) => console.log('Theme:', theme)),
      'menu-language-change': handlers.onLanguageChange || ((lang) => console.log('Language:', lang)),
      'menu-autosave-toggle': handlers.onAutoSaveToggle || ((enabled) => console.log('Auto-save:', enabled)),
      'menu-autoupdate-toggle': handlers.onAutoUpdateToggle || ((enabled) => console.log('Auto-update:', enabled)),
      'menu-org-settings': handlers.onOrgSettings || (() => console.log('Organization Settings')),
      'menu-user-profile': handlers.onUserProfile || (() => console.log('User Profile')),
      'menu-security-settings': handlers.onSecuritySettings || (() => console.log('Security Settings')),
      'menu-audit-logs': handlers.onAuditLogs || (() => console.log('Audit Logs')),
      
      // Tools menu
      'menu-template-library': handlers.onTemplateLibrary || (() => console.log('Template Library')),
      'menu-document-archive': handlers.onDocumentArchive || (() => console.log('Document Archive')),
      'menu-signature-manager': handlers.onSignatureManager || (() => console.log('Signature Manager')),
      'menu-variable-manager': handlers.onVariableManager || (() => console.log('Variable Manager')),
      'menu-import-templates': handlers.onImportTemplates || (() => console.log('Import Templates')),
      'menu-export-templates': handlers.onExportTemplates || (() => console.log('Export Templates')),
      'menu-backup-restore': handlers.onBackupRestore || (() => console.log('Backup & Restore')),
      
      // Help menu
      'menu-show-shortcuts': handlers.onShowShortcuts || (() => console.log('Show Shortcuts')),
      'menu-check-updates': handlers.onCheckUpdates || (() => console.log('Check Updates')),
    };

    // Store handler references for cleanup
    const handlerRefs = {};

    // Register all menu event listeners
    Object.keys(menuHandlers).forEach(channel => {
      const handler = (event, ...args) => {
        menuHandlers[channel](...args);
      };
      handlerRefs[channel] = handler;
      window.electronAPI.onMenuAction(channel, handler);
    });

    // Cleanup function to remove all listeners
    return () => {
      if (window.electronAPI && window.electronAPI.removeListener) {
        Object.keys(handlerRefs).forEach(channel => {
          window.electronAPI.removeListener(channel, handlerRefs[channel]);
        });
      }
    };
  }, [handlers]);

  return {
    isElectron: window.electronAPI !== undefined,
  };
};

export default useElectronMenu;
