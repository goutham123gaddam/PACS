const { sequelize, Sequelize } = require("../database");
var http = require("http");
const path = require('path');
var public = path.join(__dirname, "storage");
const { QueryTypes, Op, col } = require("sequelize");
const models = require("../models");
const fs = require('fs');
const config = require('config');
const utils = require('../utils');
const moment = require('moment');
const htmlDocx = require('html-docx-js');
const { NodesAndTemplates, PatientHeader, ReportFooter } = require("../constants");
var html_to_pdf = require('html-pdf-node');
const { exec, spawn } = require('child_process');
const message = require("simple-hl7/lib/hl7/message");
const { generateAndSendHisMessage } = require("./hl7-controller");

/////////////////// IMPORTS
const { PATIENT_ORDER } = models;

const getPatientOrdersOld = async (req, res) => {
  const {po_pin, pat_name, po_acc_no, po_ref_doc,  status, po_his_status, po_ord_no,  po_status, role, po_site, po_reported_by,
    po_body_part, po_assigned_to, modality, from_date,to_date, po_recd_date,  } = req.body;
  try {
    const whereClause = {};
    if(po_pin) {
      whereClause.po_pin = po_pin;
    }
    if(pat_name) {
      whereClause.po_pat_name = {[Sequelize.Op.like]: `%${pat_name.toUpperCase()}%`}
    }

    if(po_acc_no) {
      whereClause.po_acc_no = po_acc_no;
    }

    if(po_ref_doc) {
      whereClause.po_ref_doc_cd = po_ref_doc;
    }

    if(po_his_status) {
      whereClause.po_his_status = po_his_status;
    }

    if(po_ord_no) {
      whereClause.po_ord_no = po_ord_no;
    }

    if (modality) {
      whereClause.modality = modality;
    }

    if(po_status) {
      whereClause.po_status = po_status;
    } else {
      whereClause.po_status = {[Op.in]: ['SCANNED', 'UNREPORTED', 'REPORT_DRAFTED', 'SIGNEDOFF', 'DRAFTED']}
    }
    if(po_site) {
      whereClause.po_site = po_site;
    }
    if(po_reported_by) {
      whereClause.po_reported_by = po_reported_by;
    }
    // if(po_study_date) {
    //   whereClause.po_study_dt = {
    //     [Op.gte]: moment(po_study_date[0]).format('YYYYMMDD'), 
    //     [Op.lte]: moment(po_study_date[1]).format('YYYYMMDD') 
    //   };
    // }

    if(from_date && to_date) {
        whereClause.po_study_dt = {
        [Op.gte]: from_date, 
        [Op.lte]: to_date
      };
    }
    if(po_recd_date) {
      whereClause.po_scan_rcv_dt = {[Op.gte]: po_recd_date[0]};
      whereClause.po_scan_rcv_dt = {[Op.lte]: po_recd_date[1]};
    }
    if(po_assigned_to) {
      whereClause.po_assigned_to = po_assigned_to;
    }

    if(po_body_part) {
      whereClause[Sequelize.Op.or] = [
        {po_body_part: {[Sequelize.Op.like]: `%${po_body_part?.toUpperCase()}%` }}, 
        {po_diag_desc: {[Sequelize.Op.like]: `%${po_body_part?.toUpperCase()}%` }}
      ];
    }

    if(role == 'doc' && !status) {
      whereClause.status = {
        [Op.in]: ['SIGNEDOFF'],
      }
    }
    const pat_orders = await PATIENT_ORDER.findAll({
      where: whereClause,
      raw: true
    });
    return res.status(200).send({data: pat_orders});
  } catch (e) {
    console.log("Error", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getPatientOrders = async(req, res) => {
  const {pat_pin, pat_name, po_acc_no, po_ref_doc,  status, po_his_status, his_ord_no,  pacs_status, role, site, po_reported_by,
    po_body_part, assigned_to, modality, from_date,to_date, recd_date,  } = req.body;
  try {
    // Building the where conditions for each table
    const studiesWhere = {};
    const ordersWhere = {};
    const patientsWhere = {};
    const workflowWhere = {};
    const reportsWhere = {};

    // Add date range filter for studies
    if (from_date && to_date) {
      const convertedFromDate = moment(from_date, 'YYYYMMDD').tz('Asia/Kolkata').startOf('day')
      const convertedToDate = moment(to_date, 'YYYYMMDD').tz('Asia/Kolkata').endOf('day')
        ordersWhere.po_req_time = {
            [Op.between]: [convertedFromDate, convertedToDate]
        };
    }

    if (recd_date) {
        studiesWhere.ps_scan_received_at = {
            [Op.gte]: new Date(recd_date)
        };
    }

    // Patient filters
    if (pat_name) {
        patientsWhere.pat_name = {
            [Op.iLike]: `%${pat_name}%`
        };
    }
    if (pat_pin) {
        patientsWhere.pat_pin = pat_pin;
    }

    // Orders filters
    if (po_acc_no) ordersWhere.po_acc_no = po_acc_no;
    if (po_ref_doc) ordersWhere.po_ref_doc_cd = po_ref_doc;
    if (po_body_part) {
      if(po_body_part) {
        ordersWhere[Sequelize.Op.or] = [
          {po_body_part: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}, 
          {po_diag_desc: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}
        ];
      }
    }
    if (po_his_status) ordersWhere.po_his_status = po_his_status;
    if (his_ord_no) ordersWhere.po_his_ord_no = his_ord_no;
    if (pacs_status) {
      ordersWhere.po_pacs_status = pacs_status;
    }
    if (site) ordersWhere.po_site = site;
    if (modality) ordersWhere.po_modality = modality;

    // Workflow filter
    if (assigned_to) {
        workflowWhere.ow_assigned_rad_id = assigned_to;
    }

    // Reports filter
    if (po_reported_by) {
        workflowWhere.ow_reported_by = po_reported_by;
    }

    const orders = await models.PACS_ORDERS.findAll({
      where: ordersWhere,
      include: [
        {
          model: models.PATIENTS,
          where: patientsWhere,
          attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
        },
        {
          model: models.RIS_NOTES,
          where: {
            rn_active: 'Y'
          },
          attributes: [
            'rn_id',
            'rn_upload_type',
            'rn_upload_path',
            'rn_file_name',
            'rn_notes',
            'rn_uploaded_dt',
            'rn_uploaded_by'
          ],
          required: false,
          order: [['rn_uploaded_dt', 'DESC']]
        },
        {
          model: models.ORDER_WORKFLOW,
          where: workflowWhere,
          attributes: [
              'ow_assigned_rad_id',
              'ow_assigned_technician',
              'ow_diagnosed',
              'ow_correlated',
              'ow_reporting_blocked',
              'ow_block_reason',
              'ow_reporting_status',
              'ow_pacs_status'
          ],
          required: true
        },
      ],
      attributes: [
        'pacs_ord_id',
        'po_acc_no',
        'po_his_ord_no',
        'po_ref_doc_cd',
        'po_ref_doc',
        'po_ref_doc_id',
        'po_pacs_status',
        'po_his_status',
        'po_modality',
        'po_site',
        'po_body_part',
        'po_emergency',
        'po_req_time',
        'po_diag_desc'
      ]
    })

    return res.status(200).send({data: orders});
  } catch(e) {
    console.error("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

const getDispatchList = async(req, res) => {
  try {
    const {
          pat_name,
          po_pin,
          po_acc_no,
          po_ref_doc,
          po_body_part,
          po_his_status,
          his_ord_no,
          pacs_status,
          site,
          modality,
          po_reported_by,
          recd_date,
          assigned_to,
          from_date,
          to_date,
          po_pat_class,
          po_visit_number,
          show_rereported
      } = req.body;

      // Building the where conditions for each table
      const studiesWhere = {};
      const ordersWhere = {};
      const patientsWhere = {};
      const workflowWhere = {};
      const reportsWhere = {};

      // Add date range filter for studies
      if (from_date && to_date) {
        const convertedFromDate = moment(from_date, 'YYYYMMDD').tz('Asia/Kolkata').startOf('day')
        const convertedToDate = moment(to_date, 'YYYYMMDD').tz('Asia/Kolkata').endOf('day')

          studiesWhere.ps_study_dt_tm = {
              [Op.between]: [convertedFromDate, convertedToDate]
          };
      }

      if (recd_date) {
          studiesWhere.ps_scan_received_at = {
              [Op.gte]: new Date(recd_date)
          };
      }

      // Patient filters
      if (pat_name) {
          patientsWhere.pat_name = {
              [Op.iLike]: `%${pat_name}%`
          };
      }
      if (po_pin) {
          patientsWhere.pat_pin = po_pin;
      }

      // Orders filters
      if (po_acc_no) ordersWhere.po_acc_no = po_acc_no;
      if (po_ref_doc) ordersWhere.po_ref_doc_cd = po_ref_doc;
      if (po_pat_class) ordersWhere.po_pat_class = po_pat_class;
      if (po_visit_number) ordersWhere.po_visit_number = po_visit_number;
      if (po_body_part) {
        // ordersWhere.po_body_part = {
        //   [Op.iLike]: `%${po_body_part}%`
        // }

        if(po_body_part) {
          ordersWhere[Sequelize.Op.or] = [
            {po_body_part: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}, 
            {po_diag_desc: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}
          ];
        }
      }
      if (po_his_status) ordersWhere.po_his_status = po_his_status;
      if (his_ord_no) ordersWhere.po_his_ord_no = his_ord_no;
      if (pacs_status) {
        // ordersWhere.po_pacs_status = pacs_status;
        workflowWhere.ow_pacs_status = pacs_status;
      } else {
        // ordersWhere.po_pacs_status = {
        //   [Op.in]: ['SCANNED', 'DRAFTED', 'SIGNEDOFF', 'UNREPORTED'],
        // }
        workflowWhere.ow_pacs_status = {
          [Op.in]: ['SIGNEDOFF'],
        }
      }
      if (site) ordersWhere.po_site = site;
      if (modality) ordersWhere.po_modality = modality;

      // Workflow filter
      if (assigned_to) {
          workflowWhere.ow_assigned_rad_id = assigned_to;
      }

      if (show_rereported) {
        workflowWhere.ow_reporting_status = 'RR'
      }

      // Reports filter
      if (po_reported_by) {
          workflowWhere.ow_reported_by = po_reported_by;
      }
    
    const studies = await models.STUDIES.findAll({
      where: studiesWhere,
      include: [
          {
            model: models.PACS_ORDERS,
            where: ordersWhere,
            include: [
                {
                    model: models.PATIENTS,
                    where: patientsWhere,
                    attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
                },
            ],
            attributes: [
                'pacs_ord_id',
                'po_acc_no',
                'po_his_ord_no',
                'po_ref_doc_cd',
                'po_ref_doc',
                'po_ref_doc_id',
                'po_pacs_status',
                'po_his_status',
                'po_modality',
                'po_site',
                'po_body_part',
                'po_emergency',
                'po_req_time',
                'po_diag_desc',
                'po_pat_class',
                'po_visit_number',
                'po_priority'
            ]
          },
          {
            model: models.ORDER_WORKFLOW,
            where: workflowWhere,
            attributes: [
                'ow_assigned_rad_id',
                'ow_assigned_technician',
                'ow_diagnosed',
                'ow_correlated',
                'ow_reporting_blocked',
                'ow_block_reason',
                'ow_reporting_status',
                'ow_pacs_status',
                'ow_reported_by'
            ],
            required: true
          },
          {
            model: models.REPORTS,
            where: reportsWhere,
            attributes: [
                'pr_reported_by',
                'pr_signed_by',
                'pr_draft_time',
                'pr_signoff_time'
            ],
            required: false
          }
      ],
      order: [['ps_study_dt_tm', 'DESC']]
    });
    return res.status(200).send({data: studies});
  } catch(e) {
    console.log("Error", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getPacsList = async (req, res) => {
  // const {yh_no, name, status, role, body_part, site, assigned_to, modality} = req.body;
  const {pat_name,po_pin,po_acc_no,po_ref_doc,po_body_part,po_his_status,po_ord_no,po_status, po_site,
    modality, po_reported_by, po_study_date, po_recd_date, user_id, role, po_assigned_to, from_date, to_date} = req.body;
  try {
    const whereClause = {};
    if(po_pin) {
      whereClause.po_pin = po_pin;
    }
    if(pat_name) {
      whereClause.po_pat_name = {[Sequelize.Op.like]: `%${pat_name.toUpperCase()}%`}
    }

    if(po_acc_no) {
      whereClause.po_acc_no = po_acc_no;
    }

    if(po_ref_doc) {
      whereClause.po_ref_doc_cd = po_ref_doc;
    }

    if(po_his_status) {
      whereClause.po_his_status = po_his_status;
    }

    if(po_ord_no) {
      whereClause.po_ord_no = po_ord_no;
    }

    if (modality) {
      whereClause.modality = modality;
    }

    if(po_status) {
      whereClause.po_status = po_status;
    } else {
      whereClause.po_status = {[Op.in]: ['SCANNED', 'UNREPORTED', 'REPORT_DRAFTED', 'SIGNEDOFF', 'DRAFTED']}
    }
    if(po_site) {
      whereClause.po_site = po_site;
    }
    if(po_reported_by) {
      whereClause.po_reported_by = po_reported_by;
    }

    if(from_date && to_date) {
        whereClause.po_study_dt = {
        [Op.gte]: from_date, 
        [Op.lte]: to_date
      };
    }
    if(po_recd_date) {
      whereClause.po_scan_rcv_dt = {[Op.gte]: po_recd_date[0]};
      whereClause.po_scan_rcv_dt = {[Op.lte]: po_recd_date[1]};
    }
    if(po_assigned_to) {
      whereClause.po_assigned_to = po_assigned_to;
    }

    if(po_body_part) {
      whereClause[Sequelize.Op.or] = [
        {po_body_part: {[Sequelize.Op.like]: `%${po_body_part?.toUpperCase()}%` }}, 
        {po_diag_desc: {[Sequelize.Op.like]: `%${po_body_part?.toUpperCase()}%` }}
      ];
    }
    const pat_orders = await PATIENT_ORDER.findAll({
      where: whereClause,
      raw: false,
      nest: true,
      include: [
        {
          model: models.RIS_NOTES,
          as: 'ris_notes',
          // attributes: ['rn_id', 'rn_notes', 'rn_uploaded_dt'], 
          required: false
        },
        {
          model: models.USERS,
          as: 'ordersUser',
          attributes: ['user_id', 'user_firstname', 'user_lastname', 'user_fullname'], 
          required: false
        }
      ],
      order: [
        ['po_study_dt', 'DESC'],
        ['po_study_tm', 'DESC'],
      ],
    });
    return res.status(200).send({data: pat_orders});
  } catch (e) {
    console.log("Error", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getPacsStudiesList = async (req, res) => {
  try {
      const {
          pat_name,
          po_pin,
          po_acc_no,
          po_ref_doc,
          po_body_part,
          po_his_status,
          his_ord_no,
          pacs_status,
          site,
          modality,
          po_reported_by,
          recd_date,
          assigned_to,
          from_date,
          to_date,
          po_pat_class,
          po_visit_number,
          show_rereported,
          show_emergency,
      } = req.body;

      // Building the where conditions for each table
      const studiesWhere = {};
      const ordersWhere = {};
      const patientsWhere = {};
      const workflowWhere = {};
      const reportsWhere = {};

      // Add date range filter for studies
      if (from_date && to_date) {
        const convertedFromDate = moment(from_date, 'YYYYMMDD').tz('Asia/Kolkata').startOf('day')
        const convertedToDate = moment(to_date, 'YYYYMMDD').tz('Asia/Kolkata').endOf('day')

          studiesWhere.ps_study_dt_tm = {
              [Op.between]: [convertedFromDate, convertedToDate]
          };
      }

      if (recd_date) {
          studiesWhere.ps_scan_received_at = {
              [Op.gte]: new Date(recd_date)
          };
      }

      // Patient filters
      if (pat_name) {
          patientsWhere.pat_name = {
              [Op.iLike]: `%${pat_name}%`
          };
      }
      if (po_pin) {
          patientsWhere.pat_pin = po_pin;
      }

      // Orders filters
      if (po_acc_no) ordersWhere.po_acc_no = po_acc_no;
      if (po_ref_doc) ordersWhere.po_ref_doc_cd = po_ref_doc;
      if (po_pat_class) ordersWhere.po_pat_class = po_pat_class;
      if (po_visit_number) ordersWhere.po_visit_number = po_visit_number;
      if (po_body_part) {
        // ordersWhere.po_body_part = {
        //   [Op.iLike]: `%${po_body_part}%`
        // }

        if(po_body_part) {
          ordersWhere[Sequelize.Op.or] = [
            {po_body_part: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}, 
            {po_diag_desc: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}
          ];
        }
      }
      if (po_his_status) ordersWhere.po_his_status = po_his_status;
      if (his_ord_no) ordersWhere.po_his_ord_no = his_ord_no;
      if (pacs_status) {
        // ordersWhere.po_pacs_status = pacs_status;
        workflowWhere.ow_pacs_status = pacs_status;
      } else {
        // ordersWhere.po_pacs_status = {
        //   [Op.in]: ['SCANNED', 'DRAFTED', 'SIGNEDOFF', 'UNREPORTED'],
        // }
        workflowWhere.ow_pacs_status = {
          [Op.in]: ['SCANNED', 'DRAFTED', 'SIGNEDOFF', 'UNREPORTED'],
        }
      }
      if (site) ordersWhere.po_site = site;
      if (modality) ordersWhere.po_modality = modality;

      // Workflow filter
      if (assigned_to) {
          workflowWhere.ow_assigned_rad_id = assigned_to;
      }

      if (show_rereported) {
        workflowWhere.ow_reporting_status = 'RR'
      }

      if (show_emergency) {
        ordersWhere.po_priority = 'EMERGENCY';
      }

      // Reports filter
      if (po_reported_by) {
          workflowWhere.ow_reported_by = po_reported_by;
      }

      const studies = await models.STUDIES.findAll({
          where: studiesWhere,
          include: [
              {
                  model: models.PACS_ORDERS,
                  where: ordersWhere,
                  required: true,
                  include: [
                      {
                          model: models.PATIENTS,
                          where: patientsWhere,
                          attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
                      },
                      {
                        model: models.RIS_NOTES,
                        where: {
                            rn_active: 'Y'
                        },
                        attributes: [
                            'rn_id',
                            'rn_upload_type',
                            'rn_upload_path',
                            'rn_file_name',
                            'rn_notes',
                            'rn_uploaded_dt',
                            'rn_uploaded_by'
                        ],
                        required: false,
                        order: [['rn_uploaded_dt', 'DESC']]
                    }
                  ],
                  attributes: [
                      'pacs_ord_id',
                      'po_acc_no',
                      'po_his_ord_no',
                      'po_ref_doc_cd',
                      'po_ref_doc',
                      'po_ref_doc_id',
                      'po_pacs_status',
                      'po_his_status',
                      'po_modality',
                      'po_site',
                      'po_body_part',
                      'po_emergency',
                      'po_req_time',
                      'po_diag_desc',
                      'po_pat_class',
                      'po_visit_number',
                      'po_priority'
                  ]
              },
              {
                  model: models.ORDER_WORKFLOW,
                  where: workflowWhere,
                  attributes: [
                      'ow_assigned_rad_id',
                      'ow_assigned_technician',
                      'ow_diagnosed',
                      'ow_correlated',
                      'ow_reporting_blocked',
                      'ow_block_reason',
                      'ow_reporting_status',
                      'ow_pacs_status',
                      'ow_reported_by'
                  ],
                  required: true
              },
              {
                  model: models.REPORTS,
                  where: reportsWhere,
                  attributes: [
                      'pr_reported_by',
                      'pr_signed_by',
                      'pr_draft_time',
                      'pr_signoff_time'
                  ],
                  required: false,
                  include: [
                    {
                      model: models.USERS,
                      as: 'reportedBy',
                      attributes: [
                        'username',
                        'user_firstname',
                        'user_lastname',
                    ],
                    required: false
                  },
                  {
                    model: models.USERS,
                    as: 'signedBy',
                    attributes: [
                      'username',
                      'user_firstname',
                      'user_lastname',
                    ],
                    required: false
                  }
                ]
              }
          ],
          order: [['ps_study_dt_tm', 'DESC']]
      });
      
      return res.status(200).send({
          success: true,
          data: studies
      });
  } catch (error) {
      console.error('Error in getPacsStudiesList:', error);
      return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: error.message
      });
  }
};

const getMyWorklist = async (req, res) => {
  const {
    pat_name,
    po_pin,
    po_acc_no,
    po_ref_doc,
    po_body_part,
    po_his_status,
    his_ord_no,
    pacs_status,
    site,
    modality,
    po_reported_by,
    recd_date,
    from_date,
    to_date,
    role,
    user_id
  } = req.body;

  try {

  // Building the where conditions for each table
  const studiesWhere = {};
  const ordersWhere = {};
  const patientsWhere = {};
  const workflowWhere = {};
  const reportsWhere = {};

  // Add date range filter for studies
  if (from_date && to_date) {
    const convertedFromDate = moment(from_date, 'YYYYMMDD').tz('Asia/Kolkata').startOf('day')
    const convertedToDate = moment(to_date, 'YYYYMMDD').tz('Asia/Kolkata').endOf('day')

      studiesWhere.ps_study_dt_tm = {
          [Op.between]: [convertedFromDate, convertedToDate]
      };
  }

  if (recd_date) {
      studiesWhere.ps_scan_received_at = {
          [Op.gte]: new Date(recd_date)
      };
  }

  // Patient filters
  if (pat_name) {
      patientsWhere.pat_name = {
          [Op.iLike]: `%${pat_name}%`
      };
  }
  if (po_pin) {
      patientsWhere.pat_pin = po_pin;
  }

  // Orders filters
  if (po_acc_no) ordersWhere.po_acc_no = po_acc_no;
  if (po_ref_doc) ordersWhere.po_ref_doc_cd = po_ref_doc;
  if(po_body_part) {
    ordersWhere[Sequelize.Op.or] = [
      {po_body_part: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}, 
      {po_diag_desc: {[Sequelize.Op.iLike]: `%${po_body_part?.toUpperCase()}%` }}
    ];
  }
  if (po_his_status) ordersWhere.po_his_status = po_his_status;
  if (his_ord_no) ordersWhere.po_his_ord_no = his_ord_no;

  if (site) ordersWhere.po_site = site;
  if (modality) ordersWhere.po_modality = modality;


  if(role == 'doc' && !pacs_status) {
    workflowWhere.ow_pacs_status = {
      [Op.in]: ['SIGNEDOFF'],
    }
  }
  if (pacs_status) {
    workflowWhere.ow_pacs_status = pacs_status;
  } else {
    if (role === 'doc') {
      workflowWhere.ow_pacs_status = {
        [Op.in]: ['SIGNEDOFF'],
      }
    } else {
      workflowWhere.ow_pacs_status = {
        [Op.in]: ['SCANNED', 'DRAFTED', 'SIGNEDOFF', 'UNREPORTED'],
      }
    }
  }
  
  workflowWhere.ow_assigned_rad_id = user_id;

  // Reports filter
  if (po_reported_by) {
      workflowWhere.ow_reported_by = po_reported_by;
  }

  const studies = await models.STUDIES.findAll({
      where: studiesWhere,
      include: [
          {
              model: models.PACS_ORDERS,
              where: ordersWhere,
              include: [
                  {
                      model: models.PATIENTS,
                      where: patientsWhere,
                      attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
                  },
                  {
                    model: models.RIS_NOTES,
                    where: {
                        rn_active: 'Y'
                    },
                    attributes: [
                        'rn_id',
                        'rn_upload_type',
                        'rn_upload_path',
                        'rn_file_name',
                        'rn_notes',
                        'rn_uploaded_dt',
                        'rn_uploaded_by'
                    ],
                    required: false,
                    order: [['rn_uploaded_dt', 'DESC']]
                }
              ],
              attributes: [
                  'pacs_ord_id',
                  'po_acc_no',
                  'po_his_ord_no',
                  'po_ref_doc_cd',
                  'po_ref_doc',
                  'po_ref_doc_id',
                  'po_pacs_status',
                  'po_his_status',
                  'po_modality',
                  'po_site',
                  'po_body_part',
                  'po_emergency',
                  'po_req_time',
                  'po_diag_desc'
              ]
          },
          {
              model: models.ORDER_WORKFLOW,
              where: workflowWhere,
              attributes: [
                  'ow_assigned_rad_id',
                  'ow_assigned_technician',
                  'ow_diagnosed',
                  'ow_correlated',
                  'ow_reporting_blocked',
                  'ow_block_reason',
                  'ow_reporting_status',
                  'ow_pacs_status'
              ],
              required: true
          },
          {
              model: models.REPORTS,
              where: reportsWhere,
              attributes: [
                  'pr_reported_by',
                  'pr_signed_by',
                  'pr_draft_time',
                  'pr_signoff_time'
              ],
              required: false
          }
      ],
      order: [['ps_study_dt_tm', 'DESC']]
  });
    return res.status(200).send({data: studies, success: true});
  } catch (e) {
    console.log("Error", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getMyWorklistOld = async (req, res) => {
  // const {yh_no, name, status, role, body_part, site, assigned_to, modality, user_id} = req.body;
  const {pat_name,po_pin,po_acc_no,po_ref_doc,po_body_part,po_his_status,po_ord_no,po_status, po_site,
     modality, po_reported_by, po_study_date, po_recd_date, user_id, role} = req.body;
  try {
    const whereClause = {
      po_assigned_to: user_id
    };
    if(po_pin) {
      whereClause.po_pin = po_pin;
    }
    if(pat_name) {
      whereClause.po_pat_name = {[Sequelize.Op.like]: `%${pat_name.toUpperCase()}%`}
    }

    if(po_acc_no) {
      whereClause.po_acc_no = po_acc_no;
    }

    if(po_ref_doc) {
      whereClause.po_ref_doc_cd = po_ref_doc;
    }

    if(po_his_status) {
      whereClause.po_his_status = po_his_status;
    }

    if(po_ord_no) {
      whereClause.po_ord_no = po_ord_no;
    }

    if(po_status) {
      whereClause.po_status = po_status;
    } else {
      whereClause.po_status = {[Op.in]: ['SCANNED', 'REPORT_DRAFTED', 'SIGNEDOFF', 'DRAFTED']}
    }
    
    if(po_site) {
      whereClause.po_site = po_site;
    }
    if(po_reported_by) {
      whereClause.po_reported_by = po_reported_by;
    }
    if(po_study_date) {
      whereClause.po_study_dt = {
        [Op.gte]: moment(po_study_date[0]).format('YYYYMMDD'), 
        [Op.lte]: moment(po_study_date[1]).format('YYYYMMDD') 
      };
    }
    if(po_recd_date) {
      whereClause.po_scan_rcv_dt = {[Op.gte]: po_recd_date[0]};
      whereClause.po_scan_rcv_dt = {[Op.lte]: po_recd_date[1]};
    }
    if(modality) {
      whereClause.modality = modality;
    }
    if(role == 'doc' && !status) {
      whereClause.status = {
        [Op.in]: ['SIGNEDOFF'],
      }
    }

    if(po_body_part) {
      whereClause[Sequelize.Op.or] = [
        {po_body_part: {[Sequelize.Op.like]: `%${po_body_part?.toUpperCase()}%` }}, 
        {po_diag_desc: {[Sequelize.Op.like]: `%${po_body_part?.toUpperCase()}%` }}
      ];
    }
    const pat_orders = await PATIENT_ORDER.findAll({
      where: whereClause,
      raw: true
    });
    return res.status(200).send({data: pat_orders});
  } catch (e) {
    console.log("Error", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const updatePatientScanStatus = async (req, res, next) => {
  try {
    const pending_orders = await PATIENT_ORDER.findAll({
      raw: true,
      where: {
        po_status: {[Sequelize.Op.in]: ['PENDING']},
        // po_req_time: {[Sequelize.Op.gte]: moment().subtract(2, 'days').format('YYYYMMDD')}
      },
      attributes: ["po_pin", "po_acc_no"]
    });
    const startDate = moment().subtract(4, 'days').format('YYYYMMDD');
    const endDate = moment().format('YYYYMMDD');

    for(const order of pending_orders) { 
      // const tags = ["00100020"]; 
      const tags = utils.studyLevelTags(); // ["00100020"]; 

      const query = {
        '00100020': order.po_pin,
        '00080050': order.po_acc_no,
        limit: '555',
        offset: '0',
        fuzzymatching: 'false',
        includefield: '00081030,00080060,00401001,00080100', 
        // StudyDate: `${startDate}-${endDate}`
        // StudyDate: `20240101-20240526`
      };

      const json = await utils.doFind('STUDY', query, tags);
      if(json && json.length >0) {
        const res= json[0];        
        const acc_no = res['00080050'].Value[0];
        const modality = res['00080061'].Value[0];
        const study_dt = res['00080020'].Value[0];
        const study_tm = res['00080030'].Value[0];
        const study_id = res['00200010'].Value[0];
        const study_uid = res['0020000D'].Value[0];
        const series_count = res['00201206'].Value[0];
        const bodyPart = res['00180015']?.Value[0];

        const result = await runPythonScript(study_uid);
        

        const dicomInfo = JSON.parse(result); 
               
        const upd = await PATIENT_ORDER.update({
          po_status: 'SCANNED',
          po_acc_no: acc_no,
          modality: dicomInfo.Modality?.join(""),
          po_study_dt: study_dt,
          po_study_tm: study_tm,
          po_study_id: study_id,
          po_study_uid: study_uid,
          po_series_count: series_count,
          po_site: dicomInfo?.InstitutionAddress?.split('\r\n')[0],
          po_body_part: dicomInfo?.BodyPartExamined,
          po_his_status: 'CONFIRMED'
        }, {
          where: {
            po_pin: order.po_pin,
            po_acc_no: acc_no
          }
        });
      }
    }
    return res.status(200).send({message: "Updated"});
  } catch(e) {
    console.log("ERROR WHIEL PARSING", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updatePatientScanStatusNew = async (req, res, next) => {
  try {
    const pending_orders = await PATIENT_ORDER.findAll({
      raw: true,
      where: {
        po_status: {[Sequelize.Op.in]: ['PENDING']},
        po_req_time: {[Sequelize.Op.gte]: moment().format('YYYYMMDD')}
      },
      attributes: ["po_pin", "po_acc_no"]
    });
    if(!pending_orders?.length) {
      // console.log("No pending orders. Returning");
      return;
    }
    const startDate = moment().subtract(4, 'days').format('YYYYMMDD');
    const endDate = moment().format('YYYYMMDD');
    const BATCH_SIZE = 20;
    const delayBetweenBatches = 500;

    for (let i = 0; i < pending_orders.length; i += BATCH_SIZE) {
      const batch = pending_orders.slice(i, i + BATCH_SIZE);

      const results = await Promise.all(
      batch.map(async (order) => {

        // const tags = ["00100020"]; 
        const tags = utils.studyLevelTags(); // ["00100020"]; 

        const query = {
          '00100020': order.po_pin,
          '00080050': order.po_acc_no,
          limit: '555',
          offset: '0',
          fuzzymatching: 'false',
          includefield: '00081030,00080060,00401001,00080100', 
          // StudyDate: `${startDate}-${endDate}`
          // StudyDate: `20240101-20240526`
        };

        const json = await utils.doFind('STUDY', query, tags);
        if(json && json.length >0) {
          const res= json[0];
          
          const acc_no = res['00080050'].Value[0];
          const modality = res['00080061'].Value[0];
          const study_dt = res['00080020'].Value[0];
          const study_tm = res['00080030'].Value[0];
          const study_id = res['00200010'].Value[0];
          const study_uid = res['0020000D'].Value[0];
          const series_count = res['00201206'].Value[0];
          const bodyPart = res['00180015']?.Value[0];

          const result = await runPythonScript(study_uid);
          

          const dicomInfo = JSON.parse(result); 
                
          const upd = await PATIENT_ORDER.update({
            po_status: 'SCANNED',
            po_acc_no: acc_no,
            modality: dicomInfo.Modality?.join(""),
            po_study_dt: study_dt,
            po_study_tm: study_tm,
            po_study_id: study_id,
            po_study_uid: study_uid,
            po_series_count: series_count,
            po_site: dicomInfo?.InstitutionAddress?.split('\r\n')[0],
            po_body_part: dicomInfo?.BodyPartExamined,
            po_his_status: 'CONFIRMED'
          }, {
            where: {
              po_pin: order.po_pin,
              po_acc_no: acc_no
            }
          });
        }
      }))
      
      const resp = await utils.shutdown();
      
      const killResp  = killProcessesOnPort(8890);
      await delay(delayBetweenBatches);
      if (killResp && killResp['skippedPids'].length > 0) {

      } else {
        utils.startScp();
      }
    }
    return res.status(200).send({message: "Updated"});
  } catch(e) {
    console.log("ERROR WHIEL PARSING", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const updateStatusImpl = async () => {
  try {
    const pending_orders = await PATIENT_ORDER.findAll({
      raw: true,
      where: {
        po_status: {[Sequelize.Op.in]: ['PENDING']},
        po_req_time: {[Sequelize.Op.gte]: moment().format('YYYYMMDD')}
      },
      attributes: ["po_pin", "po_acc_no"]
    });
    if(!pending_orders?.length) {
      return;
    }
    const startDate = moment().subtract(4, 'days').format('YYYYMMDD');
    const endDate = moment().format('YYYYMMDD');
    const BATCH_SIZE = 20;
    const delayBetweenBatches = 500;

    for (let i = 0; i < pending_orders.length; i += BATCH_SIZE) {

      const batch = pending_orders.slice(i, i + BATCH_SIZE);

      const results = await Promise.all(
      batch.map(async (order) => {

        // const tags = ["00100020"]; 
        const tags = utils.studyLevelTags(); // ["00100020"]; 

        const query = {
          '00100020': order.po_pin,
          '00080050': order.po_acc_no,
          limit: '555',
          offset: '0',
          fuzzymatching: 'false',
          includefield: '00081030,00080060,00401001,00080100', 
          // StudyDate: `${startDate}-${endDate}`
          // StudyDate: `20240101-20240526`
        };

        const json = await utils.doFind('STUDY', query, tags);
        if(json && json.length >0) {
          const res= json[0];
          
          const acc_no = res['00080050'].Value[0];
          const modality = res['00080061'].Value[0];
          const study_dt = res['00080020'].Value[0];
          const study_tm = res['00080030'].Value[0];
          const study_id = res['00200010'].Value[0];
          const study_uid = res['0020000D'].Value[0];
          const series_count = res['00201206'].Value[0];
          const bodyPart = res['00180015']?.Value[0];

          const result = await runPythonScript(study_uid);
          

          const dicomInfo = JSON.parse(result); 
                
          const upd = await PATIENT_ORDER.update({
            po_status: 'SCANNED',
            po_acc_no: acc_no,
            modality: dicomInfo.Modality?.join(""),
            po_study_dt: study_dt,
            po_study_tm: study_tm,
            po_study_id: study_id,
            po_study_uid: study_uid,
            po_series_count: series_count,
            po_site: dicomInfo?.InstitutionAddress?.split('\r\n')[0],
            po_body_part: dicomInfo?.BodyPartExamined,
            po_his_status: 'CONFIRMED'
          }, {
            where: {
              po_pin: order.po_pin,
              po_acc_no: acc_no
            }
          });
        }
      }))
      
      const resp = await utils.shutdown();
      
      const killResp  = killProcessesOnPort(8890);
      await delay(delayBetweenBatches);
      if (killResp && killResp['skippedPids'].length > 0) {

      } else {
        utils.startScp();
      }
      return;
    }
  } catch(e) {
    throw e;
  }
}

const killProcessesOnPort = (port) => {
  // Find processes using the specified port
  const findCommand = `lsof -i :${port} -t`;
  let allPids = [];
  let nodePids = [];
  let skippedPids = [];

  exec(findCommand, (err, stdout, stderr) => {
    if (err || stderr) {
      console.error(`Error finding processes on port ${port}:`, err || stderr);
      return null;
    }

    // Get the process IDs (PIDs)
    const pids = stdout.split('\n').filter(pid => pid.trim());

    if (pids.length === 0) {
      return;
    }

    allPids = pids;

    const pidsOn5000 = global.INITIAL_SERVER_PORT;
    
    nodePids = pidsOn5000;
    const filteredPids = pids.filter(pid => !pidsOn5000.includes(pid));
    skippedPids = pids.filter(pid => pidsOn5000.includes(pid));

    if (filteredPids.length === 0) {
      return;
    }


    // Kill each PID that isn't running on port 5000
    const killCommand = `kill -9 ${filteredPids.join(' ')}`;
    exec(killCommand, (killErr, killStdout, killStderr) => {
      if (killErr || killStderr) {
        console.error(`Error killing processes on port ${port}:`, killErr || killStderr);
      } else {
      }
    });
  });
  
  return {allPids, nodePids, skippedPids}
};

const assignUser = async (req, res, next) => {
  const {order_ids, assigned_to} = req.body;
  try {
    const updWorkflows = await models.ORDER_WORKFLOW.update({
      ow_assigned_rad_id: assigned_to
    }, {
      where: {
        ow_pacs_ord_id: {[Op.in]: order_ids},
      }
    })
    return res.status(200).send({message: "Assigned"});
  } catch(e) {
    console.log("Error", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

// Function to run the Python script
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
};

const saveReport = async (req, res, next) => {
  const {html, yh_no, order_no, order_id, acc_no, user_id, report_id,
     status, proxy_user, diagnosed, correlated, co_signing_doctor} = req.body;
  
  let final_report_id = report_id;
  try {

    const ord_details = await models.ORDER_WORKFLOW.findOne({
      where: {
        ow_pacs_ord_id: order_id,
      },
      attributes: ['ow_reporting_blocked', 'ow_first_draft_time', 'ow_signoff_time', 'ow_pacs_status'],
      raw: true
    });

    if(ord_details && ord_details?.ow_reporting_blocked) {
      return res.status(500).send({message: "Reporting is blocked for this order"})
    }

    const folderName = path.join(__dirname, '../reports', `${yh_no}_${order_no}_${acc_no}`);
    const result = await convertHtmlToDoc(html, folderName, "test.docx");
    const statusMap = {
      'draft': 'DRAFTED',
      'reviewed': 'REVIEWED',
      'signoff': 'SIGNEDOFF',
    }
    const updObj = {
      ow_pacs_status: statusMap[status],
    };

    if (ord_details['ow_pacs_status'] === 'SIGNEDOFF') {
      updObj['ow_reporting_status'] = 'RR';
    } else if (status === 'signoff') {
      updObj['ow_reporting_status'] = '';
    }

    if(!ord_details?.ow_first_draft_time) {
      updObj['ow_first_draft_time'] = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    if(!ord_details?.ow_signoff_time && status === 'signoff') {
      updObj['ow_signoff_time'] = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    if(status === 'signoff') {
      updObj['ow_signed_by'] = proxy_user ? proxy_user : user_id;
    } 

    const upd_status =  await models.ORDER_WORKFLOW.update(
      updObj, {
      where: {
        ow_pacs_ord_id: order_id,
      }
    });

    if(report_id) {
      const updObj = {
        pr_status: statusMap[status],
        pr_report_html: html,
      };
      if (status === 'signoff') {
        updObj['pr_signed_by'] = user_id;
        if (co_signing_doctor) {
          updObj['pr_co_signed_by'] = co_signing_doctor
        }
      } else {
        updObj['pr_updated_by'] = user_id;
      }
      const updatedReport = await models.REPORTS.update(updObj, {
        where: {
          pr_id: report_id,
        }
      })
    } else {
      const wfUpdObj = {
        ow_reported_by: proxy_user ? proxy_user : user_id
      };
      if (status === 'signoff') {
        wfUpdObj['ow_signed_by'] = user_id
      }
      const wf_upd = await models.ORDER_WORKFLOW.update(wfUpdObj, {
        where: {
          ow_pacs_ord_id: order_id,
        }
      });

      const reportInsertObj = {
        pr_pin: yh_no,
        pr_pacs_ord_id: order_id,
        pr_report_html: html,
        pr_report_path: folderName,
        pr_report_name: "test.docx",
        pr_status:  statusMap[status],
        pr_report_drafted_by: user_id,
        pr_reported_by: user_id,
        pr_created_by: proxy_user || user_id,
        pr_proxied_by: proxy_user? user_id : null,
        pr_html: html,
        pr_add_dt: Sequelize.literal('CURRENT_TIMESTAMP'),
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      };
      if (status === 'signoff') {
        reportInsertObj['pr_signed_by'] = user_id;
        if (co_signing_doctor) {
          reportInsertObj['pr_co_signed_by'] = co_signing_doctor
        }
      }
      const report_inserted = await models.REPORTS.create(reportInsertObj);
      final_report_id = report_inserted?.pr_id
    }

    if (status === 'signoff') {
      // generateAndSendHisMessage(order_id, final_report_id);
    }

    // }
    return res.status(200).send({message: "Updated"});
  } catch(e) {
    console.log("Error saving", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const convertHtmlToDoc = async (htmlContent, folderPath, outputPath) => {
  var converted = htmlDocx.asBlob(htmlContent);
  let buf;
  if (Buffer.isBuffer(converted)) {
    let buffer = converted.buffer;
    buf = buffer.slice(converted.byteOffset, converted.byteOffset + converted.byteLength);
  } else {
    buf = await converted.arrayBuffer();
  }
    
  // const buf = await converted.arrayBuffer();
  // const buf = buffer.slice(converted.byteOffset, converted.byteOffset + converted.byteLength);
  const nodeBuffer = Buffer.from(buf);
  createFolderIfNotExists(folderPath);
  const filePath = path.join(folderPath, outputPath);
  fs.writeFile(filePath, nodeBuffer, function (err) {
    if (err) throw err;
  });
};

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
  }
};

const writeBlobToFile = (blob, fileName) => {

};

const getPatientReports = async (req, res, next) => {
  const {order_id, yh_no, his_ord_no, acc_no} = req.body;
  try {
    const ordDetails = await models.PACS_ORDERS.findOne({
      where: {
        pacs_ord_id: order_id
      },
      raw: true
    });
    const folderName = path.join(__dirname, 'reports', `${yh_no}_${his_ord_no}_${acc_no}`);
    const reports = await models.REPORTS.findAll({
      where: {
        pr_pacs_ord_id: order_id,
      },
      order: [['pr_id', 'DESC']]
    });
    return res.status(200).send({data: reports});
  } catch(e) {
    console.log("Error fetching", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getPriorReports = async (req, res, next) => {
  const {order_id, yh_no, his_ord_no, acc_no} = req.body;
  try {
    const ordDetails = await models.PACS_ORDERS.findAll({
      include: [
        {
          model: models.PATIENTS,
          where: {
            pat_pin: yh_no,
          },
          required: true,
        },
      ],
      where: {
        pacs_ord_id: {
          [Op.ne]: order_id,
        },
      },
      raw: true,
    });
    if(!ordDetails || !ordDetails?.length) {
      return res.status(404).send({message: "No prior reports found"});
    }
    const folderName = path.join(__dirname, 'reports', `${yh_no}_${his_ord_no}_${acc_no}`);

    const reports = await models.REPORTS.findAll({
      where: {
        pr_pacs_ord_id: {
          [Op.in]: ordDetails.map(itm => itm?.pacs_ord_id),
        }
      },
      order: [['pr_id', 'DESC']]
    });
    return res.status(200).send({data: reports});
  } catch(e) {
    console.log("Error fetching", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getTemplates = async (req, res, next) => {
  const {modality = 'CT', node} = req.query;
  try {
    // return res.status(200).send({data: NodesAndTemplates[modality]});
    const templates = await models.REPORT_TEMPLATES.findAll({
      where: {
        rt_modality: modality,
        rt_bodypart: node
      },
      raw: true
    });
    return res.status(200).send({data: templates});
  } catch(e) {
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getNodes = async (req, res, next) => {
  const {modality = 'CT'} = req.query;
  try {
    // return res.status(200).send({data: NodesAndTemplates[modality]});
    const parts = [
      {
        label: "Chest",
        code: 'CHEST'
      },
      {
        label: "Brain",
        code: 'BRAIN'
      },
      {
        label: "Head",
        code: 'HEAD'
      },
      {
        label: "Abdomen",
        code: 'ABDOMEN'
      },
      {
        label: "Hand",
        code: 'HAND'
      },
      {
        label: "Leg",
        code: 'LEG'
      },
    ];

    const bodyParts = await models.BODYPARTS_MASTER.findAll({
      where: {
        bp_modality: modality
      },
      attributes: ['bp_label', 'bp_code'],
      raw: true
    })
    return res.status(200).send({data: bodyParts?.map(itm => ({label: itm.bp_label, code: itm.bp_code}))});
  } catch(e) {
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const deleteReport = async (req, res, next) => {
  const {report_id, order_id} = req.body;
  try {
    const deleted = await models.REPORTS.destroy({
      where: {
        pr_id: report_id
      }
    });

    const reportsCount = await models.REPORTS.count({
      where: {
        pr_pacs_ord_id: order_id
      }
    });

    if (!reportsCount || reportsCount <  1) {
      const workflowUpd = await models.ORDER_WORKFLOW.update({
        ow_pacs_status: 'SCANNED',
        ow_first_draft_time: null,
        ow_signoff_time: null,
        ow_signed_by: null,
        ow_reported_by: null,
        ow_proxied_by: null
      }, {
        where: {
          ow_pacs_ord_id: order_id
        }
      });
    }
    
    return res.status(200).send({message: "Deleted"});
  } catch(e) {
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const printReport = async (req, res, next) => {
  const {report_id, html, patDetails, report, order_id} = req.body;
  try {
    const patOrdDetails = await models.PACS_ORDERS.findOne({
      where: {
        pacs_ord_id: order_id
      },
      include: [
        {
          model: models.PATIENTS,
          attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
        },
      ],
      raw: true,
      nest: true
    });   

    let options = { 
      format: 'A4', displayHeaderFooter: true, 
      headerTemplate:  PatientHeader(patOrdDetails.patient, report, patOrdDetails), 
      printBackground: true,
      displayHeaderFooter: true,
      footerTemplate: ReportFooter,
      margin: {
        top: "200px",
        bottom: "100px",
        right: "20px",
        left: "20px",
      },
    };

    const signed_by = await models.USERS.findOne({
      where: {
        username: report?.pr_signed_by,
        // user_signature: {[Op.ne]: null}
      },
      raw: true,
    })    

    let cosigned_doctor = null;

    if (report?.pr_co_signed_by) {
      cosigned_doctor = await models.USERS.findOne({
        where: {
          username: report?.pr_co_signed_by,
          // user_signature: {[Op.ne]: null}
        },
        raw: true,
      })
    }
    
    let updatedHtml = html;

    if(signed_by) {
      const signed_doc_signature = signed_by?.user_signature;
      let signature_html = ``;
      if (cosigned_doctor) {
        signature_html = `<div style="display: flex; justify-content: space-between;">
          ${cosigned_doctor.user_signature}
          ${signed_doc_signature}
        </div>`
      } else {
        signature_html = `${signed_doc_signature}`;
      }

      updatedHtml = `${updatedHtml} ${signature_html}`;
    }

    // const incrementPrintCount = await models.REPORT_PRINTS.create({
    //   po_rad_print_count: Sequelize.literal('po_rad_print_count + 1') 
    // }, {
    //   where: {
    //     po_acc_no: patDetails?.po_acc_no,
    //   }
    // });

    let file = { content: updatedHtml };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    // res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBuffer));
  } catch(e) {
    console.log("Error printing", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
};

const printReportByAcc = async(req, res) => {
  const isGetRequest = req.method === 'GET';
  const params = isGetRequest ? req.query : req.body;
  const {order_id, fromDispatch, user_id, received_by, patient_id} = params;
  try {

    if (isGetRequest && patient_id && order_id) {
      const ordDetails = await models.PACS_ORDERS.findOne({
        where: {
          pacs_ord_id: order_id,
          po_pat_pacs_id: patient_id,
        },
        raw: true
      });
      if (!ordDetails) {
        return res.status(500).message("Details entered are incorrect!");
      }
    }
    const reportContent =  await models.REPORTS.findOne({
      where: {
        pr_pacs_ord_id: order_id
      },
      raw: true
    });    

    if(!reportContent || !reportContent.pr_report_html) {
      return res.status(200).send({success: false, message: "Report Not Found"});
    }

    const patOrdDetails = await models.PACS_ORDERS.findOne({
      where: {
        pacs_ord_id: order_id
      },
      include: [
        {
          model: models.PATIENTS,
          attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
        },
      ],
      raw: true,
      nest: true
    });    

    const signed_by = await models.USERS.findOne({
      where: {
        username: reportContent?.pr_signed_by,
        user_signature: {[Op.ne]: null}
      },
      raw: true,
    })
        
    let updatedHtml = reportContent?.pr_report_html;

    let cosigned_doctor;
    
    if (reportContent?.pr_co_signed_by) {
      cosigned_doctor = await models.USERS.findOne({
        where: {
          username: reportContent?.pr_co_signed_by,
          // user_signature: {[Op.ne]: null}
        },
        raw: true,
      })
    }

    if(signed_by) {
      const signed_doc_signature = signed_by?.user_signature;
      let signature_html = ``;
      if (cosigned_doctor) {
        signature_html = `<div style="display: flex; justify-content: space-between;">
          ${cosigned_doctor.user_signature}
          ${signed_doc_signature}
        </div>`
      } else {
        signature_html = `${signed_doc_signature}`;
      }

      updatedHtml = `${updatedHtml} ${signature_html}`;
    }

    let options = { 
      format: 'A4', displayHeaderFooter: true, 
      headerTemplate:  PatientHeader(patOrdDetails?.patient, reportContent, patOrdDetails), 
      printBackground: true,
      displayHeaderFooter: fromDispatch || true,
      footerTemplate: ReportFooter,
      margin: {
        top: "200px",
        bottom: "100px",
        right: "20px",
        left: "20px",
      },
    };

    const prevPrintTaken = await models.REPORT_PRINTS.count({
      where: {
        rp_pacs_ord_id: order_id,
      }
    })

    if(fromDispatch ) {
      const insertToPrints = await models.REPORT_PRINTS.create({
        rp_pacs_ord_id: order_id,
        rp_report_id: reportContent?.pr_id,
        rp_print_type: 'DISPATCH',
        rp_printed_by: user_id,
        rp_report_received_by: received_by
      });
    }

    let file = { content: updatedHtml };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    // res.setHeader("Content-Type", "application/pdf");
    // Set proper headers for PDF serving
    if (isGetRequest) {
      res.type('application/pdf');
      res.header('Content-Disposition', `inline; filename="report-${order_id}.pdf"`);
    }
    
    res.send(Buffer.from(pdfBuffer));
  } catch(e) {
    console.log("Error printing", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const addRadUser = async (req, res, next) => {
  try {
    const maxUserSeq = await models.USERS.findAll({
      attributes: ['user_id'],
      order: [['user_id', 'DESC']],
      limit: 1
    });
    const latestUserSeq = maxUserSeq[0].user_id + 1;
    const user = await models.USERS.create({
      user_id: latestUserSeq,
      username: `pacs_rad${latestUserSeq}`,
      user_fullname: `Rad User ${latestUserSeq}`,
      user_email: `rad_user_${latestUserSeq}@rad.com`,
      user_type: 'rad',
      user_password: 'XIK[gZIL',
      user_created_dt: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    return res.status(200).send({data: user});
  } catch(e) {
    console.log("Error printing", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getRadUsersList = async (req, res, next) => {
  try {
    const rad_users = await models.USERS.findAll({
      where: {
        user_type: 'radiologist'
      },
      raw: true
    });
    return res.status(200).send({data: rad_users});
  } catch(e) {

  }
}

const saveUserFilters = async (req, res, next) => {
  const {user_id, filters, filter_id, uf_filter_name} = req.body;
  try {
    let cur_uf_id;
    if(filter_id) {
      cur_uf_id = filter_id;
    } else {
      const newUf = await models.USER_FILTERS.create({
        uf_user_id: user_id,
        uf_name: uf_filter_name,
        uf_filter_json: filters
      });
      cur_uf_id = newUf.uf_id;
      return res.status(200).send({message: "Saved the Filter", filter_id: cur_uf_id});
    }
  } catch(e) {
    console.log("Error printing", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
};

const getUserFiltersList = async (req, res, next) => {
  const {user_id} = req.body;
  try {
    const ufs = await models.USER_FILTERS.findAll({
      where: {
        uf_user_id: user_id
      },
      raw: true
    });
    return res.status(200).send({data: ufs});
  } catch(e) {
    console.log("Error getting filtes", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const getUsersList = async (req, res) => {
  const {role, user_id} = req.body;
  try {
    const whereClause = {
      is_active: 'Y'
    };
    if(role) {
      whereClause.user_type = role;
    }
    const users = await models.USERS.findAll({where: whereClause,raw: true});
    return res.status(200).send({data: users});
  } catch(e) {
    console.log("Error getting filtes", e);
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const searchReportsByKeyword = async(req, res) => {
  const {keyword, user_id, page_no} = req.body;
  try {
    const reports = await models.PATIENT_REPORTS.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('pr_html')),
            {
              [Op.like]:  `%${keyword}%`
            }
          ),
          {pr_created_by: user_id},
        ]
      },
      attributes: ['pr_id','pr_html', 'pr_pin', 'pr_acc_no', 'pr_status', 'created_at'],
      limit: 10,
      offset: page_no ? (page_no*10)+1 : 0,
      raw: true,
      order: [['created_at', 'DESC']]
    });
    const unique_acc_nos = [...new Set(reports.map(r => r.pr_acc_no))];
    const acc_ord_map = {};
    for(const rpt of reports) {
      const html = rpt['pr_html'];
      const htmlLength = html.length;
      const termIndex = html.toLowerCase().indexOf(keyword.toLowerCase());
      if(htmlLength < 80) {
        rpt['truncated'] = html;
      } else if(termIndex > 40) {
        if(html.length > termIndex+keyword.length + 80) {
          rpt['truncated'] = html.substring(termIndex - 30, termIndex + keyword.length + 60);
        } else {
          rpt['truncated'] = html.substring(termIndex -30, htmlLength-1);
        }
      } else {
        rpt['truncated'] = html.substring(termIndex, termIndex+ keyword.length + 80);
      }
      if(acc_ord_map[rpt.pr_acc_no]) {
        rpt['ord_details'] = acc_ord_map[rpt.pr_acc_no];
      } else {
        const ord_details = await getOrderDetailsFromAccNo(rpt.pr_acc_no);
        rpt['ord_details'] = ord_details;
      }
    }
    return res.status(200).send({data: reports});
  } catch(e) {
    console.log("Error", e);
    return res.status(500).send({message: "Something went wrong"})
  }
}

const getOrderDetailsFromAccNo = async (acc_no) => {
  try {
    const order = await models.PATIENT_ORDER.findOne({
      where: {
        po_acc_no: acc_no,
      },
      raw: true
    });
    return order;
  } catch(e) {
    throw e
  }
}

const getBodyPartStudyIdsFromAccNo = async (req, res) => {
  const {accession} = req.body;
  try {
    const order = await models.PATIENT_ORDER.findOne({
      where: {
        po_acc_no: accession,
      },
      // attributes: ['po_body_part', 'po_pin'],
      raw: true
    });
    const study_ids_data = await PATIENT_ORDER.findAll({
      where: {
        po_pin: order.po_pin,
        po_body_part: order.po_body_part
      },
      attributes: ['po_study_uid', 'po_acc_no'],
      raw: true
    });

    const accession_nums = study_ids_data.map(rec => rec.po_acc_no)
    const study_ids = study_ids_data.map(rec => rec.po_study_uid)
    
    return res.status(200).send({data: order, study_ids, accession_nums});
  } catch(e) {
    return res.status(500).send({error: e.message, message: "Something went wrong"});
  }
}

const saveLoadingTime = async(req, res) => {
  try {
    const {user_id, study_id, series_id, stat_type, time_taken, total_instances, modality} = req.body;
    const prev_record = await models.VIEWER_STATS.findAll({where: {vs_study_id: study_id, vs_series_id: series_id, vs_type: stat_type}});
    if(prev_record && prev_record.length >0) {
      return res.status(200).send({});
    }

    const inserted = await models.VIEWER_STATS.create({
      vs_study_id: study_id,
      vs_series_id: series_id,
      vs_type: stat_type,
      vs_user_id: user_id,
      vs_time_taken: time_taken,
      vs_total_instances: total_instances,
      vs_modality: modality,
    });

    return res.status(200).send({});
    
  } catch(e) {
    console.log("Error while saving loading times", e);
    return res.status(500).send({error: e.message, message: e.message});
  }
}

const getLoadingTimes = async (req, res) => {
  try {
    const { study_id, series_id, stat_type, user_id, modality, created_after, created_before } = req.query;

    const whereClause = {};

    if (study_id) whereClause.vs_study_id = study_id;
    if (series_id) whereClause.vs_series_id = series_id;
    if (stat_type) whereClause.vs_type = stat_type;
    if (user_id) whereClause.vs_user_id = user_id;
    if (modality) whereClause.vs_modality = modality;

    // Handle date range filtering
    if (created_after && created_before) {
      const startDate = new Date(created_after);
      const endDate = new Date(created_before);

      if (!isNaN(startDate) && !isNaN(endDate)) {
        whereClause.created_at = {
          [Op.between]: [startDate, endDate],
        };
      } else {
        return res.status(400).send({
          success: false,
          message: 'Invalid date range format.',
        });
      }
    } else if (created_after) {
      // Support for single date (backwards compatibility)
      const date = new Date(created_after);
      if (!isNaN(date)) {
        whereClause.created_at = {
          [Op.gt]: date,
        };
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid 'created_after' timestamp format.",
        });
      }
    } else if (created_before) {
      // Support for single end date
      const date = new Date(created_before);
      if (!isNaN(date)) {
        whereClause.created_at = {
          [Op.lt]: date,
        };
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid 'created_before' timestamp format.",
        });
      }
    }

    const loadingTimes = await models.VIEWER_STATS.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']], // Order by creation date, newest first
    });

    return res.status(200).send({
      success: true,
      data: loadingTimes,
      count: loadingTimes.length,
    });
  } catch (e) {
    console.log('Error while fetching loading times', e);
    return res.status(500).send({
      error: e.message,
      message: e.message,
    });
  }
};

const saveViewerInteractions= async(req, res) => {
  try {
    const {
      user_id,
      study_id,
      series_id,
      tool_name,
      tool_action,
      viewport_index,
      session_id,
      additional_data
    } = req.body;

    // Validation
    if (!user_id || !study_id || !tool_name) {
      return res.status(400).send({
        success: false,
        message: 'Required fields: user_id, study_id, tool_name'
      });
    }

    // Save to database
    const interaction = await models.VIEWER_INTERACTIONS.create({
      vti_user_id: user_id,
      vti_study_id: study_id,
      vti_series_id: series_id,
      vti_tool_name: tool_name,
      vti_tool_action: tool_action || 'use',
      vti_viewport_index: viewport_index,
      vti_session_id: session_id,
      vti_additional_data: additional_data
    });

    res.status(201).send({
      success: true,
      message: 'Tool interaction logged successfully',
      data: {
        id: interaction.vti_id,
        timestamp: interaction.vti_timestamp
      }
    });

  } catch (error) {
    console.error('Error logging tool interaction:', error);
    res.status(500).send({
      success: false,
      message: 'Failed to log tool interaction'
    });
  }
};

const addModality = async (req, res) => {
  try {
    const {
      ip,
      port,
      aet,
      name,
      operations,
      location,
      user_id,
      comments,
      en_id, // optional, present if update
    } = req.body;

    const nodeData = {
      en_ip_address: ip,
      en_ae_title: aet,
      en_port: port,
      en_node_name: name,
      en_operations: operations,
      en_location: location,
      en_comments: comments,
      en_added_dt: Sequelize.literal('CURRENT_TIMESTAMP'),
      en_added_by: user_id,
      en_active: 'Y',
    };

    if (en_id) {
      const isNodeExists = await models.EXT_NODES.findOne({ where: { en_id } });
      if (!isNodeExists) {
        return res.status(404).send({ message: 'Modality not found', success: false });
      }

      await models.EXT_NODES.update(nodeData, { where: { en_id } });

      return res.status(200).send({ message: 'Modality updated successfully', success: true });
    } else {
      await models.EXT_NODES.create(nodeData);

      return res.status(201).send({ message: 'Modality created successfully', success: true });
    }
  } catch (e) {
    console.error('Error while adding or updating modality', e);
    return res.status(500).send({ message: e.message });
  }
};

const getModalityList = async (req, res) => {
  try {
    const modalities = await models.EXT_NODES.findAll({
      where: { en_active: 'Y' },
      raw: true,
    });

    return res.status(200).send({ data: modalities });
  } catch (e) {
    console.error('Error while fetching modalities', e);
    return res.status(500).send({ message: e.message });
  }
};

const deleteModality = async (req, res) => {
  const { en_id } = req.body;
  try {
    await models.EXT_NODES.update({ en_active: 'N' }, { where: { en_id } });

    return res.status(200).send({ message: 'Modality deleted successfully', success: true });
  } catch (e) {
    console.error('Error while deleting modality', e);
    return res.status(500).send({ message: e.message });
  }
};


const pushFilesToNode = async (req, res) => {
  const {nodeDetails, studiesToPush} = req.body;
  try{
    for(const std of studiesToPush) {
      const sentFiles = utils.startScu({std, nodeDetails});
    }
    return res.status(200).send({message: "Sent Successfully"});
  } catch(e) {
    console.log("Error while pushing files");
    return res.status(500).send({message: e.message})
  }
}

const getStudyDetails = async (req, res) => {
  const {user_id, order_id} = req.body;
  try{
    let allowedToView = true;
    const ordDetails = await models.PACS_ORDERS.findOne({
      where: {
        pacs_ord_id: order_id
      },
      raw: true
    });

    if(!ordDetails) {
      return res.status(404).send({message: "Order not found"});
    }

    const openStatuses = ['SIGNEDOFF'];

    if(openStatuses?.includes(ordDetails?.po_pacs_status)) {
      return res.status(200).send({message: "SIGNEDOFF", data: ordDetails, success: true});
    }

    const workflowDetails = await models.ORDER_WORKFLOW.findOne({
      where: {
        ow_pacs_ord_id: order_id,
      }
    });

    const opened_by = workflowDetails?.ow_currently_opened_by;
    const reporting_status = workflowDetails?.ow_reporting_status;
    
    if(opened_by && opened_by !== '') {
      if(opened_by == user_id || reporting_status !== 'R') {
        const updaReportStatus = await updatePatReportStatus(req.body);
        return res.status(200).send({message: "Same User", data: ordDetails, success: true});
      } else {
        const userDetails = await models.USERS.findOne({
          where: {
            username: workflowDetails.ow_currently_opened_by
          },
          attributes: ['user_fullname', 'user_firstname', 'user_lastname'],
          raw: true
        });
        const fullname = userDetails?.user_fullname || userDetails?.user_firstname || '';
        ordDetails.po_opened_by_name = fullname;
        return res.status(200).send({message: `Study already opened by ${fullname}`, success: false});
      }
    } else {
      const workflowUpd = await models.ORDER_WORKFLOW.update({
        ow_currently_opened_by: user_id,
        ow_reporting_status: 'R'
      }, {
        where: {
          ow_pacs_ord_id: order_id,
          ow_pacs_status: {
            [Op.ne]: 'SIGNEDOFF'
          }
        }
      });
      return res.status(200).send({message: "OPEN", data: ordDetails, success: true});
    }
    
  } catch(e) {
    console.log("Error while pushing files", e);
    return res.status(500).send({message: e.message})
  }
}

const updatePatReportStatus = async({order_id}) => {
  try {
    const upd = await models.ORDER_WORKFLOW.update({
      ow_reporting_status: 'R'
    }, {
      where: {
        ow_pacs_ord_id: order_id,
        ow_pacs_status: {
          [Op.ne]: 'SIGNEDOFF'
        }
      }
    });
    return true;
  } catch(e) {
    console.log("Error while updatingPat reporting status");
    throw e;
  }
}

const closeReport = async (req, res) => {
  const {order_id} = req.body;
  try {
    const upd = await updateStudyStatus(order_id, '');

    return res.status(200).send({message: 'Report closed successfully'});
  } catch(e) {
    return res.status(500).send({message: 'Something went wrong'});
  }
}

const updateStudyStatus = async (orderId, status) => {
  try {
    const upd = await models.ORDER_WORKFLOW.update({
      ow_reporting_status: status,
      po_ping_time: null,
      ow_currently_opened_by: null
    }, {
      where: {
        ow_pacs_ord_id: orderId,
        ow_pacs_status: {
          [Op.ne]: 'SIGNEDOFF'
        }
      }
    });
    return 
  } catch(e) {
    throw new Error(e)  
  }
}

const cleanupInactiveStudies = async () => {  
  const inactiveThreshold = 2 * 60 * 1000; // 2 minutes
  const now = Date.now();
  
  const studies = await models.ORDER_WORKFLOW.findAll({
    where: {
      ow_reporting_status: 'R',
    },
    attributes: ['ow_id', 'ow_pacs_ord_id', 'ow_last_ping_time'],
    raw: true
  })
  
  for (const study of studies) {
    const pingTimeMs = new Date(study.ow_last_ping_time).getTime();

    if (now - pingTimeMs > inactiveThreshold) {
      await updateStudyStatus(study.ow_pacs_ord_id, '');
    }
  }
};

const pingStudy = async (req, res, next) => {
  const {order_id, status, user_id} = req.body;
  try {
    const studyUpd = await models.ORDER_WORKFLOW.update({
      ow_last_ping_time: Sequelize.literal("CURRENT_TIMESTAMP"),
      ow_reporting_status: status,
      ow_currently_opened_by: user_id
    }, {
      where: {
        ow_pacs_ord_id: order_id,
        ow_pacs_status: {
          [Op.ne]: 'SIGNEDOFF'
        }
      },
    });
    return res.status(200).send({message: 'study updated'});
  } catch(e) {
    console.log("Error in ping", e);
    
    return res.status(500).send({message: 'Ping failed'});
  }
}

const getOrdersListDetails = async (req, res) => {
  const {order_ids, user_id} = req.body;
  try {
    const studies = await models.STUDIES.findAll({
      include: [
          {
              model: models.PACS_ORDERS,
              where: {
                pacs_ord_id: {
                  [Sequelize.Op.in]: order_ids
                },
                
              },
              include: [
                  {
                      model: models.PATIENTS,
                      attributes: ['pat_pacs_id', 'pat_pin', 'pat_name', 'pat_sex', 'pat_dob', 'pat_unit']
                  },
                  {
                    model: models.RIS_NOTES,
                    where: {
                        rn_active: 'Y'
                    },
                    attributes: [
                        'rn_id',
                        'rn_upload_type',
                        'rn_upload_path',
                        'rn_file_name',
                        'rn_notes',
                        'rn_uploaded_dt',
                        'rn_uploaded_by'
                    ],
                    required: false,
                    order: [['rn_uploaded_dt', 'DESC']]
                }
              ],
              attributes: [
                  'pacs_ord_id',
                  'po_acc_no',
                  'po_his_ord_no',
                  'po_ref_doc_cd',
                  'po_ref_doc',
                  'po_ref_doc_id',
                  'po_pacs_status',
                  'po_his_status',
                  'po_modality',
                  'po_site',
                  'po_body_part',
                  'po_emergency',
                  'po_req_time',
                  'po_diag_desc'
              ]
          },
          {
              model: models.ORDER_WORKFLOW,
              where: {
                // [Sequelize.Op.or]: [
                //   {
                //     ow_currently_opened_by: {
                //       [Sequelize.Op.is]: null,
                //     }
                //   },
                //   {
                //     ow_currently_opened_by: user_id
                //   },
                // ],
                ow_pacs_status: {
                  [Sequelize.Op.not]: 'PENDING'
                }
              },
              attributes: [
                  'ow_assigned_rad_id',
                  'ow_assigned_technician',
                  'ow_diagnosed',
                  'ow_correlated',
                  'ow_reporting_blocked',
                  'ow_block_reason',
                  'ow_reporting_status',
                  'ow_pacs_status',
                  'ow_currently_opened_by'
              ],
              required: true
          },
          {
              model: models.REPORTS,
              attributes: [
                  'pr_reported_by',
                  'pr_signed_by',
                  'pr_draft_time',
                  'pr_signoff_time'
              ],
              required: false
          }
      ],
      order: [['ps_study_dt_tm', 'DESC']],
    });

    const conflictingStudies = [];
    const reportingDisabledStudies = [];
    const finalStudies = [];

    for (const study of studies) {
      const isOpenedBySomeoneElse = study.opened_by && study.opened_by !== currentUser;
      const isReportingBlocked = study.order_workflow?.ow_reporting_blocked === true;
      const patName = study.pacs_order?.patient?.pat_name || 'Unknown Patient';
      const diagName = study.pacs_order?.po_diag_desc || 'Unknown Study';

      if (isOpenedBySomeoneElse) {
        conflictingStudies.push({
          study: `${patName} | ${diagName}`,
          opened_by: study.opened_by,
        });
      } else if (isReportingBlocked) {
        reportingDisabledStudies.push({
          study: `${patName} | ${diagName}`,
          reason: study.order_workflow?.ow_block_reason,
        });
      } else {
        finalStudies.push(study);
      }
    }

    return res.status(200).send({
      success: true,
      data: finalStudies,
      conflictingStudies,
      reportingDisabledStudies,
    });
  } catch(e) {
    console.log("Error in getOrdersListDetails", e);
    return res.status(500).send({message: 'Failed to get orders list'});
  }
 }

 const getAllScansForOrder = async (req, res) => {
  const {his_ord_no, user_id} = req.body;
  try {
    const studies = await models.PACS_ORDERS.findAll({
      where: {
        po_his_ord_no: his_ord_no
      },
      include: [
        {
          model: models.ORDER_WORKFLOW
        }
      ],
      raw: true,
      nest: true
    });    

    return res.status(200).send({
        success: true,
        data: studies,
    });
  } catch(e) {
    console.log("Error in getOrdersListDetails", e);
    return res.status(500).send({message: 'Failed to get orders list'});
  }
 }

module.exports = {
  getPatientOrders, // modified may need fixes - for technician
  getOrdersListDetails,

  getDispatchList, // PENDING
  saveUserFilters, // no need
  getUserFiltersList, // no need
  assignUser, // modified may need fixes 
  getBodyPartStudyIdsFromAccNo,  // PENDING
  saveLoadingTime, // no need
  getLoadingTimes,
  getPacsList, // -- replacement getPacsStudiesList
  getPacsStudiesList, // modified
  getUsersList,  // no need
  updatePatientScanStatus, // no need
  saveReport,  // modified - may need fixes
  getPatientReports, // modified - may need fixes
  deleteReport, // modified - may need fixes
  printReport, // modified - may need fixes
  addRadUser, // no need
  getRadUsersList, // no need
  getMyWorklist, // modified - may need fixes
  
  searchReportsByKeyword,
  addModality,  // no need
  getModalityList,
  deleteModality,
  pushFilesToNode, // no need
  printReportByAcc, // modified - may need fies
  updatePatientScanStatusNew, // no need
  updateStatusImpl, // no need
  getNodes, // no need
  getTemplates, // no need
  getStudyDetails, // modified - may need fixes
  closeReport, // modified 
  cleanupInactiveStudies, // modified
  pingStudy,  // modified
  getAllScansForOrder,
  getPriorReports,
  saveViewerInteractions
}