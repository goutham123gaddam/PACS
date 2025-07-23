const fs = require('fs');
const path = require('path');
const dicomParser = require('dicom-parser');
const crypto = require('crypto');
const { Readable } = require('stream');
const config = require('config');
const utils = require('../utils');
const { exec } = require('child_process');
const connectionManager = require('../connection-manager-latest.js');

const logger = utils.getLogger();
const { getPatientOrders, getPacsList, updatePatientScanStatus, saveReport, getPatientReports, deleteReport, printReport, 
  addRadUser, getRadUsersList, getMyWorklist, saveUserFilters, getUserFiltersList, 
  getUsersList,
  assignUser,
  searchReportsByKeyword,
  getBodyPartStudyIdsFromAccNo,
  saveLoadingTime,
  getLoadingTimes,
  addModality,
  getModalityList,
  deleteModality,
  pushFilesToNode,
  printReportByAcc,
  updatePatientScanStatusNew,
  updateStatusImpl,
  getDispatchList,
  getNodes,
  getTemplates,
  getStudyDetails,
  closeReport,
  cleanupInactiveStudies,
  pingStudy,
  getOrdersListDetails,
  getAllScansForOrder,
  getPriorReports,
  saveViewerInteractions} = require('../controllers/pacs-controller');

  const { uploadFile, uploadNotes, fetchPrevStudies } = require('../controllers/file-controller');
  const { disableReporting, assignToSelf, toggleConfimration, toggleEmergency, fetchPatPrevNotes, updatePriorityForHISOrder } = require('../controllers/technician-controller');


  const { addUser, getPermissionsList, getUnitsList, getRolesList, deleteUser, getDiseasesList, getDoctorsList, 
    notifyPhysicians, saveTemplate, getModalities, getBodyParts, getStatusList } = require('../controllers/common-controller');
const { getPacsStudiesList } = require('../controllers/pacs-controller.js');
const { sendHL7Message } = require('../controllers/startup-controller.js');
const { oruHelper } = require('../controllers/hl7-controller.js');


module.exports = function routes(server, opts, done) {

  // Route to Handle File Upload
  server.post('/upload-file', uploadFile);
  
  server.post('/upload-notes', uploadNotes)
  
  server.post('/push-studies', pushFilesToNode);

  server.post('/trigger-hl7', async (req, res) => {
    // console.log("pat order", pat_order);
    sendHL7Message(req, res);
  });

  // server.get('/update-status', async (req, res) => {
  //   return updatePatientScanStatusNew(req, res);
  // });
  
  server.post('/orders',async (req, res) => {
    return getPatientOrders(req, res);
  });

  server.post('/send-oru-messge',async (req, res) => {
    return oruHelper(req, res);
  });
  
  server.post('/pacs-list',async (req, res) => {
    return getPacsStudiesList(req, res);
  })
  
  server.post('/dispatch-list',async (req, res) => {
    return getDispatchList(req, res);
  })
  
  server.post('/my-worklist',async (req, res) => {
    return getMyWorklist(req, res);
  });

  server.post('/orders-list-details', async (req, res) => {
    return getOrdersListDetails(req, res);
  });
  
  server.post('/save-my-filters',async (req, res) => {
    return saveUserFilters(req, res);
  });
  
  server.post('/get-saved-filters',async (req, res) => {
    return getUserFiltersList(req, res);
  });
  
  server.post('/assign-to-user',async (req, res) => {
    return assignUser(req, res);
  });
  
  server.post('/user-list', async (req, res) => {
    return getUsersList(req, res);
  })
  
  server.post('/deactivate-user', async (req, res) => {
    return deleteUser(req, res);
  })
  
  server.post('/search-reports', async (req, res) => {
    return searchReportsByKeyword(req, res);
  })
  
  server.get('/add-rad-user', async (req, res) => {
    return addRadUser(req, res);
  })
  
  server.get('/get-rad-users', async (req, res) => {
    return getRadUsersList(req, res);
  })
  
  server.post('/submit-report', async (req, res) => {
    return saveReport(req, res);
  });
  
  server.post('/print-report', async (req, res) => {
    // console.log("here");
    return printReport(req, res);
  });
  
  server.post('/print-acc-report', async (req, res) => {
    // console.log("here");
    return printReportByAcc(req, res);
  });

  server.get('/print-pat-report', async (req, res) => {
    // console.log("here");
    return printReportByAcc(req, res);
  });
  
  server.post('/delete-report', async (req, res) => {
    return deleteReport(req, res);
  });
  
  server.post('/get-reports', async (req, res) => {
    return getPatientReports(req, res);
  });

  //get-prior-reports
  server.post('/get-prior-reports', async (req, res) => {
    return getPriorReports(req, res);
  })

  server.post('/get-all-scans', async (req, res) => {
    return getAllScansForOrder(req, res);
  });

  server.post('/update-his-order-priority', async (req, res) => {
    return updatePriorityForHISOrder(req, res);
  });


  
  server.get('/get-templates', async (req, res) => {
    return getTemplates(req, res);
  });
  
  server.post("/get-body-part-study-ids", async (req, res) => {
    return getBodyPartStudyIdsFromAccNo(req, res);
  })
  
  server.post("/save-loading-time", async (req, res) => {
    return saveLoadingTime(req, res);
  })

  server.get("/no-auth/get-loading-times", async (req, res) => {
    return getLoadingTimes(req, res);
  })
  
  server.post("/add-modality", async (req, res) => {
    return addModality(req, res);
  })

  server.post('/delete-modality', async (req, res) => {
    return deleteModality(req, res);
  });

  server.get('/get-modality-list', async (req, res) => {
    return getModalityList(req, res);
  });
  
  server.post("/add-user", async (req, res) => {
    return addUser(req, res);
  })
  
  server.post("/permissions-list", async (req, res) => {
    return getPermissionsList(req, res);
  })
  
  server.post("/units-list", async (req, res) => {
    return getUnitsList(req, res);
  })
  
  server.post("/roles-list", async (req, res) => {
    return getRolesList(req, res);
  })
  
  server.post("/modalities-list", async (req, res) => {
    return getModalities(req, res);
  })
  
  server.post("/body-parts-list", async (req, res) => {
    return getBodyParts(req, res);
  })
  
  server.get("/get-nodes", async (req, res) => {
    return getNodes(req, res);
  })
  
  server.post("/add-template", async (req, res) => {
    return saveTemplate(req, res);
  })
  
  server.post("/toggle-reporting", async (req, res) => {
    return disableReporting(req, res);
  })
  
  server.post("/toggle-emergency", async (req, res) => {
    return toggleEmergency(req, res);
  })
  server.post("/toggle-confirmation", async (req, res) => {
    return toggleConfimration(req, res);
  })
  
  server.post("/assign-to-tech", async (req, res) => {
    return assignToSelf(req, res);
  })
  
  server.post("/pat-prev-notes", async (req, res) => {
    return fetchPatPrevNotes(req, res);
  })
  
  server.post("/doctors-list", async (req, res) => {
    return getDoctorsList(req, res);
  })
  
  server.post("/diseases-list", async (req, res) => {
    return getDiseasesList(req, res);
  })
  
  server.post("/notify-physicians", async (req, res) => {
    return notifyPhysicians(req, res);
  })
  
  server.post("/study-report-details", async (req, res) => {
    return getStudyDetails(req, res);
  })
  
  server.post("/close-report", async (req, res) => {
    return closeReport(req, res)
  })
  
  server.post('/study-ping', async (req, res) => {
    return pingStudy(req, res)
  })

  server.post('/save-viewer-interactions', async (req, res) => {
    return saveViewerInteractions(req, res)
  })

  server.get('/get-status-list', async (req, res) => {
    return getStatusList(req, res);
  });
  
  done();
};