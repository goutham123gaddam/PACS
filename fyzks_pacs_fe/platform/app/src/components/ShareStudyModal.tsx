import React, { useState } from 'react';
import { Modal, Input, message, Select, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { makePostCall, getUserDetails } from '../utils/helper';

const ShareStudyModal = ({ 
  visible, 
  onCancel, 
  studyUID, 
  studyDescription, 
  patientName 
}) => {
  const [loading, setLoading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const [expiryHours, setExpiryHours] = useState(48);

  const generateStudyLink = async () => {
    setLoading(true);
    try {
      const response = await makePostCall('/api/generate-study-link', {
        study_uid: studyUID,
        study_description: studyDescription || `Study for ${patientName}`,
        user_id: getUserDetails()?.username,
        expires_in_hours: expiryHours
      });

      if (response.data.success) {
        setShareableUrl(response.data.data.url);
        return response.data.data.url;
      } else {
        message.error(response.data.message || 'Failed to generate study link');
        return null;
      }
    } catch (error) {
      console.error('Error generating study link:', error);
      message.error('Failed to generate study link');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndCopy = async () => {
    let urlToUse = shareableUrl;
    
    if (!urlToUse) {
      urlToUse = await generateStudyLink();
    }
    
    if (urlToUse) {
      try {
        await navigator.clipboard.writeText(urlToUse);
        message.success('Study link generated and copied to clipboard!');
      } catch (error) {
        message.error('Link generated but failed to copy to clipboard');
      }
    }
  };

  const handleGenerateAndWhatsApp = async () => {
    let urlToUse = shareableUrl;
    
    if (!urlToUse) {
      urlToUse = await generateStudyLink();
    }
    
    if (urlToUse) {
      const message_text = encodeURIComponent(`Medical Study${patientName ? ` - ${patientName}` : ''}: ${urlToUse}`);
      window.open(`https://web.whatsapp.com/send?text=${message_text}`, '_blank');
      message.success('Study link generated and redirected to WhatsApp!');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      message.success('Study link copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy link');
    }
  };

  const expiryOptions = [
    { label: '6 Hours', value: 6 },
    { label: '24 Hours', value: 24 },
    { label: '48 Hours', value: 48 },
    { label: '7 Days', value: 168 }
  ];

  return (
    <Modal
      title={`Share Study${patientName ? ` - ${patientName}` : ''}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Study Information:
          </label>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Study UID: {studyUID}<br/>
            {studyDescription && `Description: ${studyDescription}`}
          </p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Link Expiry Time:
          </label>
          <Select
            value={expiryHours}
            onChange={setExpiryHours}
            options={expiryOptions}
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="primary" 
            icon={<CopyOutlined />}
            onClick={handleGenerateAndCopy}
            loading={loading && !shareableUrl}
            disabled={loading && !shareableUrl}
            style={{ flex: 1 }}
          >
            Generate & Copy Link
          </Button>
          
          <Button 
            style={{ 
              backgroundColor: '#25D366', 
              borderColor: '#25D366', 
              color: 'white',
              flex: 1
            }}
            onClick={handleGenerateAndWhatsApp}
            loading={loading && !shareableUrl}
            disabled={loading && !shareableUrl}
          >
            Generate & Share on WhatsApp
          </Button>
        </div>

        {shareableUrl && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Generated Study Link:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input 
                value={shareableUrl} 
                readOnly 
                style={{ flex: 1 }}
              />
              <Button 
                icon={<CopyOutlined />}
                onClick={copyToClipboard}
                title="Copy Link"
              />
            </div>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Link expires in {expiryHours} hours.
            </p>
          </div>
        )}

        <div style={{ background: '#f0f8ff', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
          <strong>Study Sharing Notes:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Anyone with this link will be able to view and download study images</li>
            <li>All access is logged for security and compliance</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ShareStudyModal;