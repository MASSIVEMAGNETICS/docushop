import React, { useState } from 'react'
import './DocumentCreator.css'

function DocumentCreator({ onBack, template }) {
  const [formData, setFormData] = useState({})
  const [previewMode, setPreviewMode] = useState(false)

  if (!template) {
    return (
      <div className="document-creator">
        <header className="header">
          <button className="btn btn-secondary" onClick={onBack}>← Back</button>
          <h1>No Template Selected</h1>
        </header>
      </div>
    )
  }

  const variables = template.variables || [
    { name: 'patient_name', type: 'string', required: true },
    { name: 'dob', type: 'date', required: true },
    { name: 'visit_date', type: 'date', required: true },
    { name: 'return_date', type: 'date', required: true },
    { name: 'physician_name', type: 'string', required: true },
    { name: 'physician_title', type: 'string', required: false }
  ]

  const handleInputChange = (varName, value) => {
    setFormData({
      ...formData,
      [varName]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating document with data:', formData)
    alert('Document created! (Demo mode)')
  }

  const renderPreview = () => {
    let previewText = `
To Whom It May Concern:

This is to verify that ${formData.patient_name || '{{patient_name}}'} (DOB: ${formData.dob || '{{dob}}'}) 
was seen on ${formData.visit_date || '{{visit_date}}'} and was under my care. 
They may return to normal duties on ${formData.return_date || '{{return_date}}'}.

Sincerely,

${formData.physician_name || '{{physician_name}}'}
${formData.physician_title || '{{physician_title}}'}
    `

    return (
      <div className="preview-content">
        <div className="preview-header">
          <h3>University Hospitals Elyria Medical Center</h3>
        </div>
        <div className="preview-body">
          <pre>{previewText}</pre>
        </div>
        <div className="signature-block">
          <div className="signature-line"></div>
          <p>Signature</p>
        </div>
      </div>
    )
  }

  return (
    <div className="document-creator">
      <header className="header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h1>Create Document: {template.name}</h1>
      </header>

      <div className="creator-container">
        <div className="creator-form">
          <div className="card">
            <h2>Fill Document Variables</h2>
            <form onSubmit={handleSubmit}>
              {variables.map((variable) => (
                <div key={variable.name} className="form-group">
                  <label htmlFor={variable.name}>
                    {variable.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {variable.required && <span className="required">*</span>}
                  </label>
                  <input
                    id={variable.name}
                    type={variable.type === 'date' ? 'date' : 'text'}
                    className="form-control"
                    value={formData[variable.name] || ''}
                    onChange={(e) => handleInputChange(variable.name, e.target.value)}
                    required={variable.required}
                  />
                </div>
              ))}

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setPreviewMode(!previewMode)}>
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>

        {previewMode && (
          <div className="creator-preview">
            <div className="card">
              <h2>Preview</h2>
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentCreator
