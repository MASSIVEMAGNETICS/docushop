import React, { useState, useRef } from 'react'
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva'
import './TemplateEditor.css'

function TemplateEditor({ onBack, template }) {
  const [elements, setElements] = useState(template?.pages?.[0]?.elements || [])
  const [selectedId, setSelectedId] = useState(null)
  const [templateName, setTemplateName] = useState(template?.name || 'New Template')
  const [variables, setVariables] = useState(template?.variables || [])
  const [showVariableDialog, setShowVariableDialog] = useState(false)
  
  const stageRef = useRef(null)

  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      w: 200,
      h: 40,
      rotation: 0,
      props: {
        text: 'Double-click to edit',
        fontSize: 14,
        fontFamily: 'Arial'
      }
    }
    setElements([...elements, newElement])
  }

  const addImageElement = () => {
    const newElement = {
      id: `image-${Date.now()}`,
      type: 'image',
      x: 100,
      y: 100,
      w: 120,
      h: 80,
      rotation: 0,
      props: {
        src: 'https://via.placeholder.com/120x80'
      }
    }
    setElements([...elements, newElement])
  }

  const addSignatureBlock = () => {
    const newElement = {
      id: `sig-${Date.now()}`,
      type: 'signature',
      x: 100,
      y: 500,
      w: 220,
      h: 64,
      rotation: 0,
      props: {
        required: true,
        pinProtected: true
      }
    }
    setElements([...elements, newElement])
  }

  const handleSave = async () => {
    const templateData = {
      id: template?.id || `tpl-${Date.now()}`,
      org_id: 'org-demo', // TODO: Get from user context
      name: templateName,
      pages: [{
        page_number: 1,
        size: 'letter',
        width: 612,
        height: 792,
        elements: elements
      }],
      variables: variables,
      created_by: 'usr-demo' // TODO: Get from authenticated user
    }

    console.log('Saving template:', templateData)
    // TODO: Call API to save template
    // In production, replace alert with proper notification component
    alert('Template saved! (Demo mode - not persisted)')
  }

  const addVariable = () => {
    const varName = prompt('Variable name (e.g., patient_name):')
    if (varName) {
      const newVar = {
        name: varName,
        type: 'string',
        required: true
      }
      setVariables([...variables, newVar])
    }
  }

  return (
    <div className="template-editor">
      <header className="editor-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <input
          type="text"
          className="template-name-input"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Template Name"
        />
        <button className="btn btn-primary" onClick={handleSave}>
          Save Template
        </button>
      </header>

      <div className="editor-container">
        {/* Left Toolbar */}
        <div className="editor-toolbar">
          <h3>Elements</h3>
          <button className="toolbar-btn" onClick={addTextElement}>
            📝 Text Block
          </button>
          <button className="toolbar-btn" onClick={addImageElement}>
            🖼️ Image
          </button>
          <button className="toolbar-btn" onClick={addSignatureBlock}>
            ✍️ Signature
          </button>
          
          <h3 style={{ marginTop: '2rem' }}>Variables</h3>
          <button className="toolbar-btn" onClick={addVariable}>
            + Add Variable
          </button>
          <div className="variable-list">
            {variables.map((v, i) => (
              <div key={i} className="variable-item">
                {'{{'}{v.name}{'}}'}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="editor-canvas">
          <div className="canvas-wrapper">
            <Stage
              width={612}
              height={792}
              style={{
                border: '1px solid #ccc',
                background: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              ref={stageRef}
            >
              <Layer>
                {/* Page background */}
                <Rect
                  x={0}
                  y={0}
                  width={612}
                  height={792}
                  fill="white"
                />
                
                {/* Elements */}
                {elements.map((element) => {
                  if (element.type === 'text') {
                    return (
                      <Text
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        text={element.props.text}
                        fontSize={element.props.fontSize}
                        fontFamily={element.props.fontFamily}
                        width={element.w}
                        height={element.h}
                        draggable
                        onClick={() => setSelectedId(element.id)}
                        onTap={() => setSelectedId(element.id)}
                      />
                    )
                  }
                  
                  if (element.type === 'signature') {
                    return (
                      <Rect
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        width={element.w}
                        height={element.h}
                        stroke="#003366"
                        strokeWidth={2}
                        dash={[5, 5]}
                        draggable
                        onClick={() => setSelectedId(element.id)}
                        onTap={() => setSelectedId(element.id)}
                      />
                    )
                  }
                  
                  return null
                })}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Right Inspector */}
        <div className="editor-inspector">
          <h3>Properties</h3>
          {selectedId ? (
            <div className="inspector-content">
              <p>Element selected: {selectedId}</p>
              <p className="inspector-help">Properties panel coming soon</p>
            </div>
          ) : (
            <div className="inspector-content">
              <p className="inspector-help">Select an element to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateEditor
