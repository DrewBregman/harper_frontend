import React, { useState } from 'react';
import { updateForm } from '../api';
import PDFViewer from './PDFViewer';

const FormEditor = ({ selectedCompanyId, pdfUrl, compact = false, onContinue }) => {
  const [formData, setFormData] = useState({
    billingPlanForPolicyIsDirect: "",
    applicantIsLLC: "",
    dateOfApplication: "",
    agency: "",
    carrier: "",
    naicCode: "",
    companyPolicyOrProgramName: "",
    programCode: "",
    agencyCustomerId: "",
    hasBusinessOwnersAttachedSections: false,
    hasCommercialGeneralLiabilitySectionsAttached: false,
    paymentPlan: "",
    methodOfPayment: "",
    audit1: "",
    applicantName1: {
      firstName: "",
      mi: "",
      lastName: ""
    },
    glCode1: "",
    sic1: "",
    naics1: "",
    feinOrSocSec1: "",
    websiteAddress: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    },
    contactInformationPrimary1: "",
    contactInformationSecondary1: "",
    premisesZipcode: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    },
    agencyCustomerId1: "",
    location: "",
    numberOfFullTimeEmployees: "",
    building: "",
    county: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    },
    location1: "",
    partTimeEmployeesNumber: 0,
    building1: "",
    annualRevenues: 0,
    location2: "",
    building2: "",
    location3: "",
    building3: "",
    descriptionOfPrimaryOperations: "",
    agencyCustomerId2: "",
    priorCarrierForGeneralLiability: "",
    priorCarrierForAutomobile: "",
    priorCarrierForProperty: "",
    agencyCustomerId3: "",
    producersName: "",
    depositAmount: "",
    minimumPremium: "",
    policyPremium: "",
    hasEquipmentFloaterSectionsAttached: false,
    hasElectronicDataProcSectionAttached: false,
    hasAccountsReceivableAttached: false,
    hasBoilerAndMachinery: false,
    hasBusinessAuto: false,
    hasPropertySectionsAttached: false,
    hasTruckersMotorCarrierSectionsAttached: false,
    hasTransportationSectionsAttached: false,
    policyNumber: "",
    agencyContactName: "",
    agencyContactPhone: "",
    agencyEmailAddress: "",
    proposedEffectiveDate: "",
    billingPlanIsAgency: false,
    field16f996340b2011f083dfd3961689d753: "",
    applicantIsNotForProfit: false,
    applicantContactName: "",
    applicantPhoneNumber: "",
    applicantEmailAddress: "",
    premisesState: "",
    hasFormalSafetyProgram: "",
    followsOsha: "",
    hasSafetyPosition: "",
    deductible: ""
  });
  const [command, setCommand] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateForm = async () => {
    if (!command.trim()) return;
    
    try {
      setIsSubmitting(true);
      setError("");
      const data = await updateForm(formData, command);
      setFormData(data.updatedFormData);
      setCommand("");
    } catch (err) {
      console.error(err);
      setError("Error updating form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="form-editor-compact">
        <h3>Form Preview</h3>
        <div className="pdf-container-compact">
          <PDFViewer fileUrl={pdfUrl} />
        </div>
        <div className="form-data-compact">
          <h4>Form Data</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="form-editor">
      <div className="form-editor-header">
        <h2>Insurance Form</h2>
        <p className="form-editor-subtitle">
          Review the generated form and continue to voice editing
        </p>
      </div>

      <div className="form-editor-body">
        {error && (
          <div className="status-message error">
            {error}
          </div>
        )}

        {pdfUrl ? (
          <>
            <div className="pdf-container">
              <div className="pdf-header">
                <h3>Form Document</h3>
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="pdf-link">
                  <span className="pdf-icon"></span>
                  View PDF
                </a>
              </div>
              <PDFViewer fileUrl={pdfUrl} />
            </div>
            
            <div className="form-data">
              <h4>Form Data</h4>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          </>
        ) : (
          <div className="loading-container">
            <p className="loading-text">Select a company to generate a form</p>
          </div>
        )}
      </div>

      <div className="form-editor-footer">
        {onContinue && pdfUrl && (
          <button 
            className="primary-button"
            onClick={onContinue}
          >
            Continue to Voice Editing
          </button>
        )}
      </div>
    </div>
  );
};

export default FormEditor;