const models = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');
const html_to_pdf = require('html-pdf-node');
const path = require('path');
const fs = require('fs');

// 1. Generate shareable link (AUTHENTICATED - only logged in users can create links)
const generateShareableLink = async (req, res) => {
  const { order_id, user_id, expires_in_hours = 168 } = req.body;

  try {
    // Create unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiry date
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expires_in_hours);

    // Save to database
    await models.SHAREABLE_REPORTS.create({
      token,
      content_type: 'report',
      order_id,
      created_by: user_id,
      expires_at: expiryDate,
      access_count: 0,
      is_active: true,
    });

    // Build URL using Fastify request object
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host;
    const shareableUrl = `${protocol}://${host}/shared-report/${token}`;

    // Use Fastify response method
    return res.send({
      success: true,
      data: {
        token,
        url: shareableUrl,
        expires_at: expiryDate,
      },
    });
  } catch (error) {
    console.error('Error generating shareable link:', error);
    return res.status(500).send({
      success: false,
      message: 'Failed to generate shareable link',
    });
  }
};

const generateShareableStudyLink = async (req, res) => {
  const { study_uid, user_id, study_description, expires_in_hours = 168 } = req.body;

  try {
    // Create unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiry date
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expires_in_hours);

    // Save to database
    await models.SHAREABLE_REPORTS.create({
      token,
      content_type: 'study',
      study_uid,
      study_description,
      created_by: user_id,
      expires_at: expiryDate,
      access_count: 0,
      is_active: true,
    });

    // Build URL using Fastify request object
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host;
    const shareableUrl = `${protocol}://${host}/study-share/${token}`;

    // Use Fastify response method
    return res.send({
      success: true,
      data: {
        token,
        url: shareableUrl,
        study_uid,
        expires_at: expiryDate,
      },
    });
  } catch (error) {
    console.error('Error generating shareable study link:', error);
    return res.status(500).send({
      success: false,
      message: 'Failed to generate shareable study link',
    });
  }
};

// 2. Handle ALL public access (PUBLIC - anyone with token can access)
const handlePublicReportAccess = async (req, res) => {
  const { token } = req.params;
  const requestType = req.query.type || 'page'; // 'page', 'pdf', or 'meta'

  try {
    // Verify token is valid and not expired
    const shareableReport = await models.SHAREABLE_REPORTS.findOne({
      where: {
        token,
        is_active: true,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!shareableReport) {
      if (requestType === 'pdf') {
        return res.status(404).send({ error: 'Report link expired or invalid' });
      }
      // For page requests, show error page
      return res.type('text/html').send(`
        <html>
          <head><title>Report Not Found</title></head>
          <body style="text-align:center; padding:50px;">
            <h1>Report Link Expired</h1>
            <p>This report link has expired or is invalid.</p>
          </body>
        </html>
      `);
    }

    // Get report and patient details - with raw query for debugging
    const order_id = shareableReport.order_id;

    // Try the include query with your existing association
    const reportDetails = await models.PACS_ORDERS.findOne({
      where: { pacs_ord_id: order_id },
      include: [
        {
          model: models.PATIENTS,
          attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob'],
        },
      ],
    });

    if (!reportDetails) {
      return res.status(404).send({ error: 'Report not found' });
    }

    // Handle different possible association names
    const patient = reportDetails.PATIENT || reportDetails.Patient || reportDetails.patient || reportDetails.PATIENTS;

    // Increment access count
    await models.SHAREABLE_REPORTS.update({ access_count: require('sequelize').literal('access_count + 1') }, { where: { token } });

    // Handle different request types
    if (requestType === 'pdf') {
      // Return PDF
      return await generateAndReturnPdf(order_id, res);
    } else if (requestType === 'meta') {
      // Return JSON metadata for React app
      const patient = reportDetails.PATIENT || reportDetails.Patient || reportDetails.patient || reportDetails.PATIENTS;
      return res.send({
        success: true,
        data: {
          patient: patient,
          order: {
            acc_no: reportDetails.po_acc_no,
            modality: reportDetails.po_modality,
            study_description: reportDetails.po_study_desc,
            his_ord_no: reportDetails.po_his_ord_no,
          },
          created_date: shareableReport.created_at,
        },
      });
    } else {
      // Return simple HTML page with WhatsApp meta tags
      const patient = reportDetails.PATIENT || reportDetails.Patient || reportDetails.patient || reportDetails.PATIENTS;
      const patientName = patient?.pat_name || 'Patient';
      const patientPin = patient?.pat_pin || 'N/A';
      const metaTitle = `Medical Report - ${patientName}`;
      const metaDescription = `Report for ${patientPin} | ${reportDetails.po_modality || 'Medical Study'}`;

      // Build URLs using Fastify request object
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers.host;
      const fullUrl = `${protocol}://${host}${req.url}`;
      const imageUrl = `${protocol}://${host}/images/medical-report-preview.png`;

      return res.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${metaTitle}</title>
          
          <!-- WhatsApp Preview Tags -->
          <meta property="og:title" content="${metaTitle}" />
          <meta property="og:description" content="${metaDescription}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${fullUrl}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Medical Reports Portal" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metaTitle}" />
          <meta name="twitter:description" content="${metaDescription}" />
          <meta name="twitter:image" content="${imageUrl}" />
        </head>
        <body style="margin:0; font-family:Arial,sans-serif; background:#f5f5f5; height:100vh; display:flex; flex-direction:column;">
          <!-- Compact Header -->
          <div style="background:white; padding:15px 20px; box-shadow:0 2px 4px rgba(0,0,0,0.1); flex-shrink:0;">
            <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h1 style="color:#333; margin:0; font-size:20px;">${metaTitle}</h1>
                <p style="color:#666; margin:5px 0 0 0; font-size:13px;">${metaDescription}</p>
              </div>
              <a href="/shared-report/${token}?type=pdf" target="_blank"
                 style="background:#007bff; color:white; padding:10px 16px; text-decoration:none; border-radius:4px; font-size:14px; white-space:nowrap;">
                 📄 Download PDF
              </a>
            </div>
          </div>
          
          <!-- Full-height PDF Viewer -->
          <div style="flex:1; background:white; margin:10px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
            <iframe src="/shared-report/${token}?type=pdf" 
                    width="100%" 
                    height="100%" 
                    style="border:none; display:block;">
            </iframe>
          </div>
          
          <!-- Compact Footer -->
          <div style="text-align:center; padding:10px; color:#999; font-size:11px; flex-shrink:0;">
            Secure medical report • Access logged for security
          </div>
        </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error handling public report access:', error);
    return res.status(500).send('Error loading report');
  }
};

// Helper function to generate PDF
async function generateAndReturnPdf(order_id, res) {
  try {
    const reportContent = await models.REPORTS.findOne({
      where: { pr_pacs_ord_id: order_id },
      raw: true,
    });

    if (!reportContent || !reportContent.pr_report_html) {
      return res.status(404).send({ error: 'Report content not found' });
    }

    // Get signatures
    const signed_by = await models.USERS.findOne({
      where: {
        username: reportContent?.pr_signed_by,
        user_signature: { [Op.ne]: null },
      },
      raw: true,
    });

    let updatedHtml = reportContent?.pr_report_html;
    if (signed_by) {
      updatedHtml = `${updatedHtml} ${signed_by.user_signature}`;
    }

    // Generate PDF
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    };

    const file = { content: updatedHtml };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    res.header('Content-Type', 'application/pdf');
    return res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).send({ error: 'Failed to generate PDF' });
  }
}

// Handle public study access
const handlePublicStudyAccess = async (req, res) => {
  const { token } = req.params;

  try {
    // Verify token is valid and not expired
    const shareableStudy = await models.SHAREABLE_REPORTS.findOne({
      where: {
        token,
        content_type: 'study',
        is_active: true,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!shareableStudy) {
      return res.type('text/html').send(`
        <html>
          <head><title>Study Not Found</title></head>
          <body style="text-align:center; padding:50px;">
            <h1>Study Link Expired</h1>
            <p>This study link has expired or is invalid.</p>
          </body>
        </html>
      `);
    }

    // Increment access count
    await models.SHAREABLE_REPORTS.update({ access_count: require('sequelize').literal('access_count + 1') }, { where: { token } });

    // Build the HTML page that will load the shared study viewer
    const studyTitle = `Medical Study - ${shareableStudy.study_description || 'DICOM Study'}`;
    const studyDescription = `StudyUID: ${shareableStudy.study_uid}`;

    // Build URLs using Fastify request object
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers.host;
    const fullUrl = `${protocol}://${host}${req.url}`;
    const imageUrl = `${protocol}://${host}/images/medical-study-preview.png`;

    return res.type('text/html').send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${studyTitle}</title>
        
        <!-- WhatsApp Preview Tags -->
        <meta property="og:title" content="${studyTitle}" />
        <meta property="og:description" content="${studyDescription}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${fullUrl}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Medical Study Portal" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${studyTitle}" />
        <meta name="twitter:description" content="${studyDescription}" />
        <meta name="twitter:image" content="${imageUrl}" />
        
        <!-- Load your OHIF viewer assets -->
        <script>
          window.PUBLIC_URL = '/';
          // Pass the token and study UID to the viewer
          window.SHARED_STUDY_TOKEN = '${token}';
          window.SHARED_STUDY_UID = '${shareableStudy.study_uid}';
        </script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <script defer="defer" src="/app.bundle.js"></script>
        <link href="/app.bundle.css" rel="stylesheet">
      </head>
      <body>
        <div id="root"></div>
        <div id="shared-study-root"></div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error handling public study access:', error);
    return res.status(500).send('Error loading study');
  }
};

module.exports = {
  generateShareableLink,
  generateShareableStudyLink,
  handlePublicReportAccess,
  handlePublicStudyAccess,
};
