import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BASE_API } from '../axios';
import { CopyOutlined } from '@ant-design/icons';

function PdfViewer({ pdfArrayBuffer, patient_id, order_id }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);

  const reportUrl = useMemo(() => {
    return `${BASE_API}/print-pat-report?order_id=${order_id}&patient_id=${patient_id}`
  }, [patient_id, order_id])

  useEffect(() => {
    if (pdfArrayBuffer) {
      // Convert ArrayBuffer to Blob
      const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

      // Create a Blob URL
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Force refresh after URL is created
      setTimeout(() => {
        setKey(prev => prev + 1);
      }, 100);

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfArrayBuffer]);

  const handleIframeLoad = () => {
    // Additional check after load
    setTimeout(() => {
      const iframe = iframeRef.current;
      if (iframe) {
        try {
          // If iframe appears empty, reload it
          if (iframe.contentWindow && iframe.contentWindow.document.body.children.length === 0) {
            iframe.src = iframe.src;
          }
        } catch (e) {
          // Expected cross-origin error, ignore
        }
      }
    }, 1000);
  };

  if (!pdfUrl) {
    return <div>Loading PDF...</div>;
  }

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(reportUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000)
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* Quick action buttons */}
      <div style={{
        // position: 'absolute',
        top: '20px',
        right: '10px',
        display: 'flex',
        gap: '5px',
        marginBottom: '4px'
      }}>
        <button
          onClick={() => setKey(prev => prev + 1)}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          title="Refresh PDF"
        >
          ↻
        </button>
        <button
          onClick={() => window.open(reportUrl, '_blank')}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          title="Open in new tab"
        >
          ↗
        </button>
        <button
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: 'rgb(134 155 173)',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => copyToClipBoard()}
          title='Copy Report URL'
        >
          <CopyOutlined />
        </button>
        {copied && (
          <span style={{color: 'green'}} className='success-text'>Link copied, ready to share!</span>
        )}
      </div>

      <iframe
        key={key} // This forces re-render
        ref={iframeRef}
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=100`}
        width="100%"
        height="100%"
        title="PDF Viewer"
        style={{
          border: 'none',
          backgroundColor: 'white', // Ensure white background
          minHeight: '600px'
        }}
        onLoad={handleIframeLoad}
        // These attributes can help with display issues
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="eager"
      />
    </div>
  );
}

export default PdfViewer;
