import axios from 'axios';

const API_BASE_URL = "http://localhost:8000"; 

export async function fetchCompanies() {
  const response = await axios.get(`${API_BASE_URL}/companies/`);
  return response.data;
}

export async function fetchCompanyMemory(companyId) {
  const response = await axios.get(`${API_BASE_URL}/companies/${companyId}/memory`);
  return response.data;
}

export async function generateForm(companyId) {
  // First fetch the company's memory data
  const memoryData = await fetchCompanyMemory(companyId);
  
  // Then send both the company ID and memory data to generate the form
  const response = await axios.post(`${API_BASE_URL}/forms/generate`, {
    company_id: String(companyId),
    memory_data: memoryData
  });
  
  console.log("PDF Generation Response:", response.data);
  
  // The backend returns a direct URL path, so we need to prepend the API base URL
  const pdfUrl = `${API_BASE_URL}${response.data}`;
  console.log("Full PDF URL:", pdfUrl);
  
  return {
    pdf_url: pdfUrl
  };
}

export async function updateForm(formData, updateCommand) {
  const response = await axios.post(`${API_BASE_URL}/forms/update`, {
    formData,
    updateCommand
  });
  return response.data; // => { updatedFormData: {...} }
}

export async function undoForm(companyId) {
  const response = await axios.post(`${API_BASE_URL}/forms/undo/${companyId}`);
  return response.data; // => { updatedFormData: {...} }
}