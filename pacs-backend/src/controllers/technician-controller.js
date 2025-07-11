const { sequelize, Sequelize } = require("../database");
var http = require("http");
const path = require('path');
var public = path.join(__dirname, "storage");
const { QueryTypes, Op, col } = require("sequelize");
const fs = require('fs');
const utils = require('../utils');
const htmlDocx = require('html-docx-js');
const { PATIENT_ORDER, BLOCKED_ORDERS, ORDER_WORKFLOW, PACS_ORDERS } = require("../models");


const disableReporting = async(req, res) => {
  const {order_id, user_id, shouldBlock, ord_no, site} = req.body;
  try {
    const updated = await ORDER_WORKFLOW.update({
      ow_reporting_blocked: shouldBlock,
    }, {
      where: {
        ow_pacs_ord_id: order_id
      }
    });

    const blockedPrev = await BLOCKED_ORDERS.findOne({
      where: {
        bo_pacs_ord_id: order_id,
      }
    })

    if(blockedPrev) {
      const upd = await BLOCKED_ORDERS.update({
        bo_blocked_state: shouldBlock ? 'Y' : 'N',
      }, {
        where: {
          bo_pacs_ord_id: order_id,
        }
      })
    } else {
      await BLOCKED_ORDERS.create({
        bo_pacs_ord_id: order_id,
        bo_site: site,
        bo_blocked_state: shouldBlock ? 'Y' : 'N',
        bo_blocked_by: user_id
      });
    }
    return res.status(200).send({message: "Updated successfully"})

  } catch(e) {
    console.log("Error while disabling ", e);
    
    return res.status(500).send({message: e.message});
  }
}

const toggleConfimration = async(req, res) => {
  const {order_id, user_id, shouldConfirm, ord_no, site} = req.body;
  try {
    const updated = await PACS_ORDERS.update({
      po_his_status: shouldConfirm ? 'CONFIRMED' : 'UNCONFIRMED',
    }, {
      where: {
        pacs_ord_id: order_id,
      }
    });
    return res.status(200).send({message: "Updated successfully"})

  } catch(e) {
    console.log("Error while disabling ", e);
    
    return res.status(500).send({message: e.message});
  }
}

const toggleEmergency = async(req, res) => {
  const {order_id, user_id, markEmergency, ord_no, site} = req.body;
  try {
    const updated = await PACS_ORDERS.update({
      po_emergency: markEmergency ? 'Y' : 'N',
      po_priority: markEmergency ? 'EMERGENCY' : 'NORMAL',
    }, {
      where: {
        pacs_ord_id: order_id
      }
    });
    return res.status(200).send({message: "Updated successfully"})

  } catch(e) {
    console.log("Error while disabling ", e);
    
    return res.status(500).send({message: e.message});
  }
}


const assignToSelf = async(req, res) => {
  const {order_id, user_id, ord_no} = req.body;
  try {
    const upd = await ORDER_WORKFLOW.update({
      ow_assigned_technician: user_id
    }, {
      where: {
        ow_pacs_ord_id: order_id,
      }
    })
    return res.status(200).send({message: "Updated successfully"})

  } catch(e) {
    console.log("Error while assigning ", e);
    
    return res.status(500).send({message: e.message});
  }
}

const fetchPatPrevNotes = async(req, res) => {
  const {acc_no, user_id, ord_no, pin} = req.body;
  try {

    const prevNotes = await sequelize.query(
      `
      SELECT 
        DATE(rn_uploaded_dt) AS creationDate, 
        JSON_AGG(ris_notes.*) AS rows
      FROM ris_notes
      where rn_pin='${pin}'
      GROUP BY DATE(rn_uploaded_dt)
      ORDER BY creationDate DESC;
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).send({message: "Fetched successfully", data: prevNotes});
  } catch(e) {
    console.log("Error while fetching notes ", e);
    return res.status(500).send({message: e.message});
  }
}

const updatePriorityForHISOrder = async (req, res) => {
  const {his_ord_id, priority} = req.body;
  try {
    const upd = await PACS_ORDERS.update({
      po_priority: priority
    }, {
      where: {
        po_his_ord_no: his_ord_id
      }
    });
    return res.status(200).send({success: true, message: 'Updated Successfully'});
  } catch (e) {
    console.log("Error updating priority", e);
    return res.status(500).send({message: e.message});
  }
}

module.exports = {
  disableReporting, // modified
  assignToSelf, // modified
  toggleEmergency, // modified
  toggleConfimration, // modified
  fetchPatPrevNotes, // pending
  updatePriorityForHISOrder
};