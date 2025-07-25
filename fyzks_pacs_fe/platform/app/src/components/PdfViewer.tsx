import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BASE_API } from '../axios';
import { CopyOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { makePostCall, getUserDetails } from '../utils/helper';

function PdfViewer({ pdfArrayBuffer, patient_id, order_id }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [linkGenerating, setLinkGenerating] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setShareableLink('');
    setCopied(false);
  }, [order_id, patient_id]);

  // Original direct report URL (for fallback)
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

  // Generate shareable link on-demand
  const generateShareableLink = async () => {
    if (shareableLink) {
      return shareableLink; // Already generated for this patient, reuse it
    }

    setLinkGenerating(true);
    try {      
      const response = await makePostCall('/api/generate-shareable-link', {
        order_id: order_id,
        user_id: getUserDetails()?.username,
        expires_in_hours: 168 // 7 days
      });

      if (response.data.success) {
        const generatedLink = response.data.data.url;
        setShareableLink(generatedLink);
        return generatedLink;
      } else {
        message.error(`Failed to generate link: ${response.data.message || 'Unknown error'}`);
        return reportUrl; // Fallback to direct URL
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
      message.error(`Error: ${error.response?.data?.message || error.message || 'Network error'}`);
      return reportUrl; // Fallback to direct URL
    } finally {
      setLinkGenerating(false);
    }
  };

  // NEW: Copy button now generates link on-demand
  const copyToClipBoard = async () => {
    if (linkGenerating) {
      message.warning('Please wait, generating shareable link...');
      return;
    }

    try {
      const linkToShare = await generateShareableLink();
      await navigator.clipboard.writeText(linkToShare);
      setCopied(true);
      
      if (linkToShare === reportUrl) {
        message.success('Direct report link copied!');
      } else {
        message.success('WhatsApp-friendly link copied!');
      }
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      message.error('Failed to copy link');
    }
  };

  // NEW: WhatsApp share now generates link on-demand
  const shareOnWhatsApp = async () => {
    if (linkGenerating) {
      message.warning('Please wait, generating shareable link...');
      return;
    }

    try {
      const linkToShare = await generateShareableLink();
      const message_text = encodeURIComponent(`Medical Report - Please view: ${linkToShare}`);
      window.open(`https://web.whatsapp.com/send?text=${message_text}`, '_blank');
    } catch (error) {
      message.error('Failed to generate shareable link');
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* Quick action buttons */}
      <div style={{
        top: '20px',
        right: '10px',
        display: 'flex',
        gap: '5px',
        marginBottom: '4px',
        flexWrap: 'wrap',
        alignItems: 'center'
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
        
        {/* Open in new tab - uses shareable link if available, otherwise direct URL */}
        <button
          onClick={() => window.open(shareableLink || reportUrl, '_blank')}
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
        
        {/* Copy Link Button - now generates on-demand */}
        <button
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: linkGenerating ? '#ccc' : 'rgb(134 155 173)',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: linkGenerating ? 'not-allowed' : 'pointer',
            opacity: linkGenerating ? 0.6 : 1
          }}
          onClick={copyToClipBoard}
          title={linkGenerating ? 'Generating shareable link...' : 'Copy shareable report URL'}
          disabled={linkGenerating}
        >
          {linkGenerating ? '⏳' : <CopyOutlined />}
        </button>

        {/* WhatsApp Share Button - now generates on-demand */}
        <button
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: linkGenerating ? '#ccc' : '#25D366',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: linkGenerating ? 'not-allowed' : 'pointer',
            opacity: linkGenerating ? 0.6 : 1
          }}
          onClick={shareOnWhatsApp}
          disabled={linkGenerating}
          title={linkGenerating ? 'Generating shareable link...' : 'Share on WhatsApp'}
        >
          {linkGenerating ? '⏳' : <WhatsAppOutlined />}
        </button>

        {/* Status Messages */}
        {copied && (
          <span style={{color: 'green', fontSize: '11px', fontWeight: 'bold'}} className='success-text'>
            Link copied!
          </span>
        )}

        {linkGenerating && (
          <span style={{color: '#666', fontSize: '11px', padding: '2px 5px'}}>
            Generating link...
          </span>
        )}

        {shareableLink && !linkGenerating && (
          <span style={{color: '#25D366', fontSize: '11px', fontWeight: 'bold', padding: '2px 5px'}}>
            ✓ Ready to share
          </span>
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