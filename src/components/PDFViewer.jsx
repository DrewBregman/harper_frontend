import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PDFViewer({ fileUrl }) {
  return (
    <div style={{ height: '100%' }}>
      <Worker workerUrl="/pdfjs/pdf.worker.min.js">
        <Viewer 
          fileUrl={fileUrl}
          renderLoader={(percentages) => (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column'
            }}>
              <div className="loading-spinner"></div>
              <p style={{ 
                marginTop: '0.75rem', 
                color: 'var(--text-secondary)',
                fontSize: '0.8125rem'
              }}>
                {Math.round(percentages)}%
              </p>
            </div>
          )}
        />
      </Worker>
    </div>
  );
}

export default PDFViewer;