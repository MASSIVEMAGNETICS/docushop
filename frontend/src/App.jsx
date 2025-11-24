import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import TemplateEditor from './pages/TemplateEditor'
import DocumentCreator from './pages/DocumentCreator'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

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
