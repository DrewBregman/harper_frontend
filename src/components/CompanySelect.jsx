import React, { useState, useEffect } from 'react';
import { fetchCompanies, fetchCompanyMemory, generateForm } from '../api';

const CompanySelect = ({ onSelectCompany, onPdfGenerated }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyMemory, setCompanyMemory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState("");

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        setLoadingStep("Loading companies...");
        setError(null);
        const data = await fetchCompanies();
        
        // Handle the nested data structure
        if (data && data.companies && Array.isArray(data.companies)) {
          // Ensure each company has a unique ID
          const companiesWithUniqueIds = data.companies.map((company, index) => ({
            ...company,
            uniqueId: `${company.id}-${index}`
          }));
          setCompanies(companiesWithUniqueIds);
        } else {
          console.error("Unexpected data format:", data);
          setCompanies([]);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies");
        setCompanies([]);
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    }
    loadCompanies();
  }, []);

  const handleCompanyChange = async (e) => {
    const newVal = e.target.value;
    setSelectedCompany(newVal);
    onSelectCompany(newVal);

    if (newVal) {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch company memory
        setLoadingStep("Loading company data...");
        const data = await fetchCompanyMemory(newVal);
        setCompanyMemory(data.memory);
        
        // Generate PDF with the memory data
        setLoadingStep("Generating PDF...");
        const pdfData = await generateForm(newVal);
        onPdfGenerated(pdfData.pdf_url);
      } catch (err) {
        console.error("Error processing company:", err);
        setError("Failed to process company data");
        setCompanyMemory(null);
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    } else {
      setCompanyMemory(null);
      onPdfGenerated(null);
    }
  };

  return (
    <div className="company-select-container">
      <div className="company-select-header">
        <h2>Select a Company</h2>
        <p className="company-select-subtitle">
          Choose a company to generate an insurance form
        </p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="company-selector">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">{loadingStep || "Loading..."}</p>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="company-dropdown">Company Name</label>
            <select 
              id="company-dropdown"
              onChange={handleCompanyChange} 
              value={selectedCompany}
              className="company-dropdown"
            >
              <option value="">-- Select a company --</option>
              {companies.map((c) => (
                <option key={c.uniqueId} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedCompany && companyMemory && !loading && (
        <div className="company-memory">
          <h3>Company Information</h3>
          <div className="memory-data">
            <pre>{JSON.stringify(companyMemory, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelect;