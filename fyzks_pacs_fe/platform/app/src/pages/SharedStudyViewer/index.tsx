import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

// Import your existing OHIF viewer components
// We'll reuse the viewer infrastructure but with modifications
import { ViewportGridProvider, ImageViewerProvider } from '@ohif/ui-next';
import ViewportGrid from '../../components/ViewportGrid';

const SharedStudyViewer = ({ 
  extensionManager, 
  servicesManager, 
  commandsManager, 
  hotkeysManager 
}) => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [studyUID, setStudyUID] = useState(null);
  const [error, setError] = useState(null);
  const [studyInfo, setStudyInfo] = useState(null);

  // Validate token and get study UID
  useEffect(() => {
    const validateTokenAndLoadStudy = async () => {
      try {
        setLoading(true);
        
        // For now, we'll extract study info from the global variables
        // that were set by the backend HTML
        if (window.SHARED_STUDY_TOKEN === token && window.SHARED_STUDY_UID) {
          setStudyUID(window.SHARED_STUDY_UID);
          setStudyInfo({
            study_uid: window.SHARED_STUDY_UID,
            description: 'Shared Medical Study'
          });
          
          // Initialize the study in OHIF
          await initializeStudy(window.SHARED_STUDY_UID);
          
        } else {
          setError('Invalid or expired study link');
        }
        
      } catch (err) {
        console.error('Error loading shared study:', err);
        setError('Failed to load study');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateTokenAndLoadStudy();
    }
  }, [token]);

  // Initialize OHIF viewer with the study
  const initializeStudy = async (studyInstanceUID) => {
    try {
      const { displaySetService, hangingProtocolService } = servicesManager.services;
      
      // This mimics your existing viewer initialization
      // The DICOM endpoints are already public, so this should work
      
      // You might need to adapt this based on your specific OHIF setup
      console.log('Initializing shared study viewer for:', studyInstanceUID);
      
      // Set up study data for OHIF
      // This will use your existing public DICOM endpoints
      
    } catch (error) {
      console.error('Error initializing study:', error);
      setError('Failed to initialize study viewer');
    }
  };

  // Download all images as ZIP
  const downloadStudyAsZip = async () => {
    try {
      message.info('Preparing download... This may take a few minutes for large studies.');
      
      // This will be implemented in the next part of the task
      console.log('Download ZIP functionality - to be implemented');
      message.info('Download feature will be implemented next!');
      
    } catch (error) {
      console.error('Error downloading study:', error);
      message.error('Failed to download study');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        background: '#000'
      }}>
        <Spin size="large" style={{ color: 'white' }} />
        <span style={{ marginTop: '16px', fontSize: '16px', color: 'white' }}>
          Loading medical study...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#000',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#ff4d4f', marginBottom: '16px' }}>Study Not Available</h2>
          <p style={{ marginBottom: '24px' }}>{error}</p>
          <Button type="primary" onClick={() => window.location.href = '/'}>
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: '#000', position: 'relative' }}>
      {/* Custom Header for Shared Viewer - NO BACK BUTTON */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50px',
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000
      }}>
        <div style={{ color: 'white', fontSize: '16px' }}>
          <span>📋 Shared Medical Study</span>
          {studyInfo && (
            <span style={{ marginLeft: '10px', opacity: 0.7, fontSize: '14px' }}>
              {studyInfo.description}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={downloadStudyAsZip}
            style={{ fontSize: '14px' }}
          >
            Download ZIP
          </Button>
        </div>
      </div>

      {/* OHIF Viewer Container */}
      <div style={{ height: '100%', paddingTop: '50px' }}>
        <ImageViewerProvider>
          <ViewportGridProvider>
            {/* This is where your OHIF viewer will render */}
            {/* You'll need to adapt this based on your existing viewer setup */}
            <ViewportGrid 
              servicesManager={servicesManager}
              extensionManager={extensionManager}
              commandsManager={commandsManager}
              hotkeysManager={hotkeysManager}
            />
          </ViewportGridProvider>
        </ImageViewerProvider>
      </div>
      
      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30px',
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px'
      }}>
        Secure shared medical study • Access logged for security
      </div>
    </div>
  );
};

export default SharedStudyViewer;