const API_BASE_URL = '/api'

export async function getTemplates(orgId = 'org-demo') {
  try {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/templates`)
    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching templates:', error)
    // Re-throw to allow caller to handle the error
    throw error
  }
}

export async function getTemplate(orgId, templateId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/templates/${templateId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch template')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

export async function createTemplate(orgId, templateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    })
    if (!response.ok) {
      throw new Error('Failed to create template')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

export async function createDocument(orgId, templateId, variables, createdBy) {
  try {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: templateId,
        filled_variables: variables,
        created_by: createdBy,
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to create document')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

export async function renderDocument(orgId, docId, format = 'pdf') {
  try {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/docs/${docId}/render?format=${format}`, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to render document')
    }
    return await response.json()
  } catch (error) {
    console.error('Error rendering document:', error)
    throw error
  }
}

export async function signDocument(orgId, docId, signatureData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/docs/${docId}/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signatureData),
    })
    if (!response.ok) {
      throw new Error('Failed to sign document')
    }
    return await response.json()
  } catch (error) {
    console.error('Error signing document:', error)
    throw error
  }
}
