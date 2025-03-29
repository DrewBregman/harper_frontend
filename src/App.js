import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import CompanySelect from './components/CompanySelect';
import FormEditor from './components/FormEditor';
import VoiceInterface from './components/VoiceInterface';

function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  // Move to next step when a company is selected
  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
    if (companyId) setActiveStep(2);
  };

  // Move to step 3 when PDF is ready
  const handlePdfGenerated = (url) => {
    setPdfUrl(url);
    if (url) setActiveStep(Math.max(activeStep, 2));
  };

  return (
    <div className="app-container">
      <div className="container">
        <header className="header">
          <h1>Harper AI - Insurance Form Generator</h1>
          <SignedIn>
            <div className="user-section">
              <UserButton />
            </div>
          </SignedIn>
        </header>
        
        <SignedOut>
          <div className="auth-section fade-in">
            <h2>Welcome to Harper AI</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Please sign in to access the insurance form generator.
            </p>
            <SignIn />
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="workflow-steps">
            <div className={`workflow-step ${activeStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Select Company</div>
            </div>
            <div className="step-connector"></div>
            <div className={`workflow-step ${activeStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">View Form</div>
            </div>
            <div className="step-connector"></div>
            <div className={`workflow-step ${activeStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Voice Edit</div>
            </div>
          </div>

          <main className="workflow-content">
            {activeStep === 1 && (
              <div className="company-selection-panel fade-in">
                <CompanySelect 
                  onSelectCompany={handleCompanySelect} 
                  onPdfGenerated={handlePdfGenerated}
                />
              </div>
            )}

            {activeStep === 2 && (
              <div className="form-viewer-panel fade-in">
                <FormEditor 
                  selectedCompanyId={selectedCompanyId} 
                  pdfUrl={pdfUrl}
                  onContinue={() => setActiveStep(3)}
                />
              </div>
            )}

            {activeStep === 3 && (
              <div className="voice-editor-panel fade-in">
                <div className="panel-split">
                  <div className="panel-left">
                    <VoiceInterface 
                      selectedCompanyId={selectedCompanyId}
                      onFormUpdate={(updatedFormData) => {
                        // When voice command updates the form, refresh the PDF
                        if (updatedFormData) {
                          handlePdfGenerated(pdfUrl);
                        }
                      }}
                    />
                  </div>
                  <div className="panel-right">
                    <FormEditor 
                      selectedCompanyId={selectedCompanyId} 
                      pdfUrl={pdfUrl}
                      compact={true}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="workflow-nav">
              {activeStep > 1 && (
                <button 
                  className="back-button"
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Back
                </button>
              )}
              
              {activeStep < 3 && activeStep > 1 && pdfUrl && (
                <button 
                  className="next-button"
                  onClick={() => setActiveStep(activeStep + 1)}
                >
                  Continue
                </button>
              )}
            </div>
          </main>
        </SignedIn>
      </div>
    </div>
  );
}

export default App;