import React, { useState, useEffect } from 'react'
import { getTemplates } from '../services/api'
import './Dashboard.css'

function Dashboard({ onNavigate, onSelectTemplate }) {
  const [templates, setTemplates] = useState([])
  const [stats, setStats] = useState({
    totalTemplates: 0,
    recentDocs: 0,
    pendingSignatures: 0
  })

  useEffect(() => {
    // Load templates
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      // In production, this would fetch from the API
      // For MVP, using demo data
      const demoTemplates = [
        {
          id: 'tpl-001',
          name: "Doctor's Excuse / Return-to-Work",
          description: 'Official medical excuse letter for school or work',
          created_at: new Date().toISOString(),
        },
        {
          id: 'tpl-002',
          name: 'Verification of Visit',
          description: 'Confirms patient was seen on a specific date',
          created_at: new Date().toISOString(),
        },
        {
          id: 'tpl-003',
          name: 'Medical Leave Letter',
          description: 'Specifies expected leave period and limitations',
          created_at: new Date().toISOString(),
        }
      ]
      
      setTemplates(demoTemplates)
      setStats({
        totalTemplates: demoTemplates.length,
        recentDocs: 42,
        pendingSignatures: 5
      })
      
      // Uncomment when API is ready:
      // const data = await getTemplates('org-demo')
      // setTemplates(data)
      // setStats({ totalTemplates: data.length, ... })
    } catch (error) {
      console.error('Error loading templates:', error)
      // In production, show user-friendly error message
      setTemplates([])
    }
  }

  const handleCreateTemplate = () => {
    onSelectTemplate(null)
    onNavigate('template-editor')
  }

  const handleEditTemplate = (template) => {
    onSelectTemplate(template)
    onNavigate('template-editor')
  }

  const handleCreateDocument = (template) => {
    onSelectTemplate(template)
    onNavigate('document-creator')
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>DocuShop</h1>
        <p>Document Composition Platform</p>
      </header>

      <div className="container">
        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalTemplates}</div>
            <div className="stat-label">Templates</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.recentDocs}</div>
            <div className="stat-label">Documents Created</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pendingSignatures}</div>
            <div className="stat-label">Pending Signatures</div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="card">
          <div className="card-header">
            <h2>Templates</h2>
            <button className="btn btn-primary" onClick={handleCreateTemplate}>
              + New Template
            </button>
          </div>

          <div className="template-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-icon">📄</div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleCreateDocument(template)}
                  >
                    Create Document
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleEditTemplate(template)}
                  >
                    Edit Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <span className="activity-text">Document created: Medical Leave Letter - Patient #1234</span>
              <span className="activity-time">2 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✍️</span>
              <span className="activity-text">Document signed: Doctor's Excuse - Patient #5678</span>
              <span className="activity-time">5 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📋</span>
              <span className="activity-text">Template updated: Verification of Visit</span>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
