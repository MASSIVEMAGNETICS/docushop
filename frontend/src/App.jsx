import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import TemplateEditor from './pages/TemplateEditor'
import DocumentCreator from './pages/DocumentCreator'
import useElectronMenu from './hooks/useElectronMenu'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Handle Electron menu events
  useElectronMenu({
    // File menu
    onNewTemplate: () => {
      setSelectedTemplate(null);
      setCurrentPage('template-editor');
    },
    onNewDocument: () => {
      setSelectedTemplate(null);
      setCurrentPage('document-creator');
    },
    
    // View menu
    onViewDashboard: () => setCurrentPage('dashboard'),
    onViewEditor: () => setCurrentPage('template-editor'),
    onViewCreator: () => setCurrentPage('document-creator'),
    
    // You can add more handlers as needed
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} onSelectTemplate={setSelectedTemplate} />
      case 'template-editor':
        return <TemplateEditor onBack={() => setCurrentPage('dashboard')} template={selectedTemplate} />
      case 'document-creator':
        return <DocumentCreator onBack={() => setCurrentPage('dashboard')} template={selectedTemplate} />
      default:
        return <Dashboard onNavigate={setCurrentPage} onSelectTemplate={setSelectedTemplate} />
    }
  }

  return (
    <div className="app">
      {renderPage()}
    </div>
  )
}

export default App
