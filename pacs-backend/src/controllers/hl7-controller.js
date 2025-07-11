const hl7 = require('simple-hl7');
const { PACS_ORDERS, PATIENTS, REPORTS } = require('../models');

// Modality configuration
const modalityConfig = {
  CT: {
    departmentCode: 'CT',
    needsContrastInfo: true,
    resultFormat: 'structured'
  },
  MR: {
    departmentCode: 'MR',
    needsContrastInfo: true,
    resultFormat: 'structured'
  },
  US: {
    departmentCode: 'US',
    needsMeasurements: true,
    resultFormat: 'narrative'
  },
  CR: {
    departmentCode: 'CR',
    resultFormat: 'narrative'
  },
  DX: {
    departmentCode: 'DX',
    resultFormat: 'narrative'
  },
  NM: {
    departmentCode: 'NM',
    needsRadiopharmInfo: true,
    resultFormat: 'structured'
  },
  PT: {
    departmentCode: 'PT',
    needsRadiopharmInfo: true,
    resultFormat: 'structured'
  },
  // Add more modalities as needed
  DEFAULT: {
    departmentCode: 'RX',
    resultFormat: 'narrative'
  }
};

// Create an MLLP client
const client = hl7.Server.createTcpClient('192.152.80.15', 6614);

/**
 * Sends an ORU message to the HIS system with radiology report results
 * @param {Object} reportData - Object containing report data
 * @returns {Promise} - Promise resolving to the ACK message
 */
function sendORUMessage(reportData) {
  try {
    // Validate required fields
    validateReportData(reportData);
    
    // Create a new HL7 message
    const msg = new hl7.Message();
    
    // Get modality configuration
    const config = modalityConfig[reportData.modality] || modalityConfig.DEFAULT;
    
    // Set message type to ORU^R01 (Observation Result)
    msg.header.setField(9, 'ORU^R01');
    
    // MSH - Message Header
    msg.header.setField(3, 'FYZKS_PACS');      // Sending application
    msg.header.setField(4, 'SOMAJIGUDA');      // Sending facility // 
    msg.header.setField(5, 'HIS');           // Receiving application
    msg.header.setField(6, 'SMJ1');          // Receiving facility
    msg.header.setField(7, getCurrentDateTime()); // Message date/time
    msg.header.setField(10, generateMessageId()); // Message control ID
    msg.header.setField(11, 'P');            // Processing ID
    msg.header.setField(12, '2.3');          // Version ID
    
    // PID - Patient Identification
    const pid = msg.addSegment('PID');
    pid.setField(3, reportData.patientId);   // Patient ID
    pid.setField(5, reportData.patientName); // Patient name
    pid.setField(7, reportData.patientDob);  // Date of birth
    pid.setField(8, reportData.patientGender); // Gender
    
    // PV1 - Patient Visit
    const pv1 = msg.addSegment('PV1');
    pv1.setField(2, reportData.patientClass); // Patient class (I/O)
    if (reportData.visitNumber) {
      pv1.setField(19, reportData.visitNumber); // Visit number
    }
    
    // ORC - Common Order
    const orc = msg.addSegment('ORC');
    orc.setField(1, reportData.status === 'cancelled' ? 'CA' : 'SC'); // Order control
    orc.setField(2, reportData.accessionNumber); // Placer order number
    orc.setField(5, 'CM');                    // Order status
    
    // OBR - Observation Request
    const obr = msg.addSegment('OBR');
    obr.setField(1, '1');                     // Set ID
    obr.setField(2, reportData.accessionNumber); // Placer order number
    obr.setField(3, reportData.orderNumber);  // Filler order number (ph_prf_num)
    obr.setField(4, `${reportData.procedureCode}^${reportData.procedureDesc}`); // Universal service ID
    obr.setField(7, reportData.studyDateTime); // Observation date/time
    if (reportData.referringDocId) {
      obr.setField(16, `${reportData.referringDocId}^${reportData.referringDocName || ''}`); // Ordering provider
    }
    
    // Apply modality-specific department code and then map according to rules if needed
    let departmentCode = config.departmentCode;
    if (reportData.departmentCode) {
      // Override with report-specific code if provided
      departmentCode = reportData.departmentCode;
    }
    obr.setField(24, departmentCode); // Diagnostic service section ID
    obr.setField(36, reportData.studyDateTime); // Scheduled date/time
    
    // Apply department code mapping rules from Mirth channel
    mapDepartmentCode(msg);
    
    // OBX - Observation Result for main report
    let obxCounter = 1;
    const obx = msg.addSegment('OBX');
    obx.setField(1, obxCounter++);           // Set ID
    obx.setField(2, 'TX');                    // Value type
    obx.setField(3, 'Report');                // Observation identifier
    obx.setField(4, reportData.reportVersion || '1'); // Observation sub-ID
    obx.setField(5, reportData.reportText);   // Observation value
    obx.setField(11, reportData.finalReport ? 'F' : 'P'); // Observation result status
    obx.setField(16, reportData.radiologistId); // Responsible observer
    
    // Add modality-specific OBX segments
    addModalitySpecificSegments(msg, reportData, config, obxCounter);
    
    // Send the message
    return new Promise((resolve, reject) => {
      client.send(msg, (err, ack) => {
        if (err) {
          console.error('Error sending message:', err);
          reject(err);
        } else {
          console.log('Message sent successfully!');
          // console.log('ACK received:', ack.toString());
          resolve(ack);
        }
      });
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return Promise.reject(error);
  }
}

/**
 * Validates required fields in the report data
 * @param {Object} reportData - Object containing report data
 * @throws {Error} If required fields are missing
 */
function validateReportData(reportData) {
  const requiredFields = [
    'patientId', 
    'accessionNumber', 
    'orderNumber', 
    'procedureCode', 
    'reportText',
    'radiologistId'
  ];
  
  for (const field of requiredFields) {
    if (!reportData[field]) {
      throw new Error(`Required field missing: ${field}`);
    }
  }
}

/**
 * Apply department code mapping rules from Mirth channel
 * @param {Object} msg - HL7 message object
 */
function mapDepartmentCode(msg) {
  const obr = msg.getSegment('OBR');
  const deptCode = obr.getField(24);
  
  // Apply mapping rules from your Mirth channel
  if (deptCode === 'DX,CR' || deptCode === 'CR,DX') {
    obr.setField(24, 'IM');
  } else if (deptCode === 'PT,CT' || deptCode === 'CT,PT') {
    obr.setField(24, 'PT');
  }
}

/**
 * Add modality-specific OBX segments
 * @param {Object} msg - HL7 message object
 * @param {Object} reportData - Report data
 * @param {Object} config - Modality configuration
 * @param {Number} obxCounter - Current OBX counter
 */
function addModalitySpecificSegments(msg, reportData, config, obxCounter) {
  // Add contrast information for CT/MRI
  if (config.needsContrastInfo && reportData.contrastInfo) {
    const contrastObx = msg.addSegment('OBX');
    contrastObx.setField(1, obxCounter++);
    contrastObx.setField(2, 'TX');
    contrastObx.setField(3, 'ContrastInfo');
    contrastObx.setField(5, reportData.contrastInfo);
    contrastObx.setField(11, reportData.finalReport ? 'F' : 'P');
  }
  
  // Add measurements for ultrasound
  if (config.needsMeasurements && reportData.measurements) {
    for (const measurement of reportData.measurements) {
      const measObx = msg.addSegment('OBX');
      measObx.setField(1, obxCounter++);
      measObx.setField(2, 'NM');
      measObx.setField(3, measurement.name);
      measObx.setField(5, measurement.value);
      measObx.setField(6, measurement.units);
      measObx.setField(11, reportData.finalReport ? 'F' : 'P');
    }
  }
  
  // Add radiopharmaceutical information for Nuclear Medicine/PET
  if (config.needsRadiopharmInfo && reportData.radiopharmInfo) {
    const rpObx = msg.addSegment('OBX');
    rpObx.setField(1, obxCounter++);
    rpObx.setField(2, 'TX');
    rpObx.setField(3, 'RadiopharmInfo');
    rpObx.setField(5, reportData.radiopharmInfo);
    rpObx.setField(11, reportData.finalReport ? 'F' : 'P');
  }
  
  // Add impression if it's separated from the main report
  if (reportData.impression) {
    const impObx = msg.addSegment('OBX');
    impObx.setField(1, obxCounter++);
    impObx.setField(2, 'TX');
    impObx.setField(3, 'Impression');
    impObx.setField(5, reportData.impression);
    impObx.setField(11, reportData.finalReport ? 'F' : 'P');
  }
}

/**
 * Generate a unique message ID
 * @returns {String} Message ID
 */
function generateMessageId() {
  return 'MSG' + Date.now() + Math.floor(Math.random() * 10000);
}

/**
 * Get current date time in HL7 format
 * @returns {String} Date time in YYYYMMDDHHMMSS format
 */
function getCurrentDateTime() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Example of how to use the function for different modalities
 */

// Example for CT Scan
const ctReportData = {
  patientId: '11234567',
  patientName: 'SMITH^JOHN',
  patientDob: '19780101',
  patientGender: 'M',
  patientClass: 'O',
  visitNumber: '123456',
  accessionNumber: '302000001',
  orderNumber: '12345678',
  procedureCode: '123',
  procedureDesc: 'CT CHEST WITH CONTRAST',
  studyDateTime: '20250415123456',
  referringDocId: 'SHA',
  referringDocName: 'DR.DOCTOR',
  departmentCode: 'CT',
  reportText: 'TECHNIQUE: Contrast-enhanced CT of the chest was performed.\n\nFINDINGS: The lungs are clear without focal consolidation, pneumothorax, or pleural effusion. No pulmonary nodules are identified. The heart is normal in size. No pericardial effusion. The thoracic aorta is normal in caliber. No mediastinal, hilar, or axillary lymphadenopathy. No aggressive osseous lesions.',
  impression: 'Normal CT examination of the chest.',
  contrastInfo: 'Omnipaque 350, 100ml IV',
  radiologistId: 'RADIOLOGIST1',
  finalReport: true,
  reportVersion: '1',
  modality: 'CT'
};

const generateAndSendHisMessage = async(pacs_ord_id, report_id) => {
  try {
    const patOrdDetails = await PACS_ORDERS.findOne({
      where: {
        pacs_ord_id,
      },
      include: [
        {
          model: PATIENTS,
        },
        {
          model: REPORTS,
          where: {
            pr_id: report_id
          }
        }
      ],
      raw: true,
      nest: true
    });
    // console.log("patOrdDetails", patOrdDetails);
    const {patients, reports} = patOrdDetails;
    const {pat_pin, pat_name, pat_dob, pat_sex} = patients;
    const {po_pat_class, po_pat_location, po_visit_number, po_acc_no, po_his_ord_no, po_diag_no,
       po_diag_desc,po_ref_doc_cd, po_ref_doc, po_modality } = patOrdDetails;
      
    const {pr_report_html, pr_reported_by, pr_signed_by} = reports;
    const reportData = {
      patientId: pat_pin,
      patientName: 'SMITH^JOHN',
      patientDob: pat_dob,
      patientGender: pat_sex,
      patientClass: po_pat_class,
      visitNumber: po_visit_number,
      accessionNumber: po_acc_no,
      orderNumber: po_his_ord_no,
      procedureCode: po_diag_no,
      procedureDesc: po_diag_desc,
      studyDateTime: '20250415123456',
      referringDocId: po_ref_doc_cd,
      referringDocName: po_ref_doc,
      departmentCode: 'CT', // todo
      reportText: 'TECHNIQUE: Contrast-enhanced CT of the chest was performed.\n\nFINDINGS: The lungs are clear without focal consolidation, pneumothorax, or pleural effusion. No pulmonary nodules are identified. The heart is normal in size. No pericardial effusion. The thoracic aorta is normal in caliber. No mediastinal, hilar, or axillary lymphadenopathy. No aggressive osseous lesions.',
      impression: 'Normal CT examination of the chest.',
      contrastInfo: 'Omnipaque 350, 100ml IV',
      radiologistId: pr_signed_by,
      finalReport: true,
      reportVersion: '1',
      modality: po_modality
    }

    sendORUMessage(reportData).then(res => {
      console.log("Oru message sent response", res);
      return
    })
    .catch(e => {
      console.log("Error while sending the oru message");
      return
    })
    
  } catch(e) {
    console.log("Error while sending ORU message", e);
    return
  }
}

/**
 * Export functions for use in other modules
 */
module.exports = {
  sendORUMessage,
  modalityConfig,
  generateAndSendHisMessage
};