// controllers/fileController.js
const path = require('path');
const fs = require('fs');
const { DICOM_METADATA, PATIENT_ORDER, LEGACY_STUDIES, RIS_NOTES, PACS_ORDERS, PATIENTS, STUDIES, ORDER_WORKFLOW } = require('../models');
const { sequelize, Sequelize } = require("../database");
const message = require('simple-hl7/lib/hl7/message');
const utils = require('../utils');
const { exec, spawn } = require('child_process');
const moment = require('moment');
const axios = require('axios');

// Controller function to handle file upload and respond with path
const uploadFile = async (request, res) => {
  try{
    const body = request.body;
    const file = body.file[0];

    const {order_id, pin, file_type, user_id} = body;

    const baseDir = path.join(__dirname, '../../public/uploads');
    const patPath = path.join(pin, order_id, file_type);
    const nestedPath = path.join(baseDir, patPath);

    // Check if the directory already exists
    if (!fs.existsSync(nestedPath)) {
      console.log("path", nestedPath);
      
      // Recursively create the directories
      const dirCreated = fs.mkdirSync(nestedPath, { recursive: true });
      console.log(`Created directories: ${nestedPath}`, dirCreated);
    } else {
      console.log("else");
      // console.log(`Directories already exist: ${nestedPath}`);
    }

    const uploadPath = path.join(nestedPath, file.filename);
    const buffer = file.data; // Convert stream to buffer
    fs.writeFileSync(uploadPath, buffer); 
    const insertRisNotes = await RIS_NOTES.create({
      rn_pin: pin,
      rn_pacs_ord_id: order_id,
      rn_upload_type: file_type,
      rn_upload_path: path.join(patPath, file.filename),
      rn_file_name: file.filename,
      rn_uploaded_dt: Sequelize.literal('CURRENT_TIMESTAMP'),
      rn_uploaded_by: user_id,
      rn_active: 'Y',
    })
    res.send({ message: 'File uploaded successfully', filename: uploadPath });
  } catch(e) {
    console.log("error", e);
    return res.status(500).send({message: e.message})
  }
  
}

const uploadNotes = async(req, res) => {
  try {
    const body = req.body;
    const {acc_no, ord_no, order_ids, pin, user_id, notes} = body;

    const orderIdArray = order_ids?.split(',');
    for(const ordId of orderIdArray) {
      const addNotes = await RIS_NOTES.create({
        rn_pin: pin,
        rn_pacs_ord_id: ordId,
        rn_pin: pin,
        rn_upload_type: "notes",
        rn_notes: notes,
        rn_uploaded_by: user_id,
        rn_uploaded_dt: Sequelize.literal('CURRENT_TIMESTAMP'),
        rn_active: 'Y',
        rn_order_id: ordId
      });
    }
    return res.status(200).send({message: "Notes Added"});
  } catch(e) {
    console.log("Error", e);
    return res.status(500).send({message: e.message})
  }
}

// Example function to handle a new study directory
const handleNewStudy = async (dirPath) => {
  try {
    // Add your processing logic for studies here
  console.log(`Processing new study at: ${dirPath}`);
  // const study_uid = dirPath.split('/')[1]; // for local or same data folder 
  const study_uid = dirPath; // for ext data folder

  const result = await runPythonScript(study_uid);
  const dicomInfo = JSON.parse(result); 
  
  const {AdditionalMetadataTags={}} = dicomInfo;
  const {PatientName, PatientID, Modality, ImageType, InstitutionName, InstitutionalDepartmentName, SiteName, BodyPartExamined, StudyDate, StudyTime, AcquisitionDateTime,
    AccessionNumber, StudyDescription, SamplesPerPixel, Rows, Columns, PixelSpacing, StudyInstanceUID, StudyID, InstitutionAddress, StationName,
  } = AdditionalMetadataTags;

  console.log("dicom info", PatientName);
  if(AdditionalMetadataTags['(0019,0010)']  && AdditionalMetadataTags['(0019,1001)'] === 'FROM_LEGACY_PACS') {
    return;
  }

  const ordDets = await PACS_ORDERS.findOne({
    where: {
      po_acc_no: AccessionNumber,
    },
    include: [
      {
        model: PATIENTS,
      }
    ],
    nest: true,
    attributes: [
      'po_his_ord_no', 'po_diag_desc', 'pacs_ord_id'
    ]
  });

  let confirmation = 'UNCONFIRMED';

  if(ordDets) {
    const {patient} = ordDets;
    const {pat_name, pat_pin,} = patient;
    const {po_his_ord_no, po_diag_desc, pacs_ord_id} = ordDets;

    if(pat_name === PatientName && pat_pin === PatientID && po_diag_desc === StudyDescription) {
      confirmation = 'CONFIRMED';
    }

    const ordUpd = await PACS_ORDERS.update({
      po_pacs_status: 'SCANNED',
      po_modality: Modality,
      po_body_part: BodyPartExamined,
      po_site: SiteName || InstitutionAddress?.split('\r\n')[0] || 'SOMAJIGUDA',
      po_his_status: confirmation
    }, {
      where: {
        pacs_ord_id,
      }
    });

    const workflowUpd = await ORDER_WORKFLOW.update({
      ow_study_id: StudyID,
      ow_pacs_status: 'SCANNED',
    }, {
      where: {
        ow_pacs_ord_id: pacs_ord_id
      }
    });

    const combinedStr = `${StudyDate} ${StudyTime}`;
    const parsedDate = moment.utc(combinedStr, "YYYYMMDD HHmmss.SSSSSS");

    // const sequelizeDate = parsedDate.toDate();

    const adjustedDate = parsedDate.subtract(5, 'hours').subtract(30, 'minutes').toDate();
    
    const studyCreated = await STUDIES.create({
      ps_pacs_ord_id: pacs_ord_id,
      ps_study_id: StudyID,
      ps_study_dt_tm: adjustedDate, //StudyDate + StudyTime,
      ps_study_uid: StudyInstanceUID,
      ps_scan_received_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      ps_first_img_time: moment().subtract(1, 'minute')
    })

    // const upd = await PATIENT_ORDER.update({
    //   po_status: 'SCANNED',
    //   modality: Modality,
    //   po_study_dt: StudyDate,
    //   po_study_tm: StudyTime,
    //   po_study_id: StudyID,
    //   po_study_uid: StudyInstanceUID,
    //   // po_series_count: series_count,
    //   po_site: SiteName || InstitutionAddress?.split('\r\n')[0],
    //   po_body_part: BodyPartExamined,
    //   po_his_status: confirmation,
    //   po_scan_rcv_tm: moment().format('YYYYMMDDHHmmss'),
    //   po_first_img_time: moment().subtract(1, 'minute').format('YYYYMMDDHHmmss')
    // }, {
    //   where: {
    //     po_pin: PatientID,
    //     po_acc_no: AccessionNumber
    //   }
    // });

    const insertDicomMetadata = await DICOM_METADATA.create({
      dcm_study_uid: StudyInstanceUID,
      dcm_pacs_ord_id: pacs_ord_id,
      dcm_study_tm: sequelizeDate,
      dcm_samples_per_pixel: SamplesPerPixel,
      dcm_rows: Rows,
      dcm_columns: Columns,
      dcm_pixel_spacing: Array.isArray(PixelSpacing) ? PixelSpacing?.join(',') : PixelSpacing || '',
      dcm_modality: Modality,
      dcm_station_name: StationName,
      dcm_dept: InstitutionalDepartmentName,
      dcm_image_type: Array.isArray(ImageType) ? ImageType?.join(',') : ImageType,
    });
  }
  return
  } catch(e) {
    console.error("Error while updating dicom inof", e);
    return;
  }
};

const runPythonScript = (study_id) => {  
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['dicom.py', study_id]);

    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      
      if (code !== 0) {
        reject(`Python process exited with code ${code}\nstderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

const fetchPrevStudies = async(req) => {
  const {pin} = req;
  try {
    const server_ip = process.env.PREV_PACS_SERVER;
    const port = process.env.PREV_PACS_PORT;
    const exlude_db_ids= [];
    const legacy_details = await LEGACY_STUDIES.findAll({
      where: {

      },
      attributes: ['ls_pat_id', 'ls_acc_no', 'ls_ord_no', 'ls_old_pacs_db_id'],
      raw: true
    });
    const prevDBIds = [];

    legacy_details?.forEach(itm => {
      prevDBIds.push(itm.ls_old_pacs_sb_id);
    });

    const newPacsOrders = await PATIENT_ORDER.findAll({
      where: {
        po_status: {[Sequelize.Op.not]: 'PENDING'},
        po_his_status: {[Sequelize.Op.not]: 'CANCELLED'},
        po_pin: pin,
      },
      attributes: ['po_acc_no', 'po_ord_no'],
      raw: true
    });

    const newOrdAccNos = newPacsOrders?.map(itm => (({acc_no: itm.po_acc_no, ord_no: itm.po_ord_no})))

    const data = {
      patient_id: pin,
      exlude_db_ids: prevDBIds || [],
      acc_nos: newOrdAccNos || [],
      exclude_combinations: [[]],
    };

    // console.log("CALLING PREV PACS API", `${server_ip}:${port}/push_studies`);
    // console.log("payload", data);
    
    const response = await axios.post(`${server_ip}:${port}/push_studies`, data);
    // console.log("Response from prev pacs: ", response?.data);
    const {studies} = response.data;
    for(const std of studies) {
      const {HIS_Status, center_id, folder_location, instanceUID, accessionNo, orderNumber, modality='', site, studyDate, studyDesc,  studyTime, patient_dbId} = std;
      const inserted = await LEGACY_STUDIES.create({
        ls_moadlity: modality,
        ls_acc_no: accessionNo,
        ls_ord_no: orderNumber,
        ls_pat_id: pin,
        ls_old_pacs_db_id: patient_dbId,
        ls_folder_path: folder_location,
        ls_site: site,
        ls_study_ids: instanceUID
      });
    }
    return;
  } catch(e) {
    console.error("Error fetching previous studies: ", e?.data || e.message);
    return;
  }
}


module.exports = {
  uploadFile,  // modified - may need fixes
  uploadNotes, // modified - may need fixes
  handleNewStudy, // modified - may need fixes
  
  fetchPrevStudies, // PENDING
};
