const moment = require('moment'); 

const NodesAndTemplates = {
  CT: {
    'ABDOMEN': [{label: 'ABDOMEN PLAIN', template: 'ct_abdomen_without_contrast'}],
    'ANGIO': [],
    'BRAIN': [
      {label: 'BRAIN PLAIN (TRAUMA) Dr. Revanesh', template: 'ct_brain_without_contrast'},
      {label: 'BRAIN PLAIN WITH CONTRAST', template: 'ct_brain_with_contrast'},
    ],
    'CHEST': [],
    'LEG': [],
  },
  DX: {
    'ABDOMEN': [
      {label: 'XRAY ABDOMEN ERECT', template: 'dx_abdomen_erect'},
      {label: 'XRAY ABDOMEN SUPIN', template: 'dx_abdomen_supin'},
    ],
    'CHEST': [
      {label: 'XRAY CHEST AP (BED SIDE)', template: 'dx_chest_ap_bedside'},
      {label: 'XRAY CHEST AP', template: 'dx_chest_ap'},
      {label: 'XRAY CHEST PA', template: 'dx_chest_pa'},
    ],
    'HAND': [
      {label: 'XRAY LT ARM AP LAT', template: 'dx_lt_arm_ap_lateral'},
      {label: 'XRAY LT ELBOW AP LAT', template: 'dx_lt_elbow_ap_lateral'},
      {label: 'XRAY RT ELBOW AP LAT', template: 'dx_rt_elbow_ap_lateral'},
      {label: 'XRAY LT FEMUR AP LAT', template: 'dx_lt_femur_ap_lateral'},
      {label: 'XRAY RT FEMUR AP LAT', template: 'dx_rt_femur_ap_lateral'},
      {label: 'XRAY LT FOREARM AP LAT', template: 'dx_lt_forearm_ap_lateral'},
      {label: 'XRAY RT FOREARM AP LAT', template: 'dx_rt_forearm_ap_lateral'},
      {label: 'XRAY LT HUMERUS AP LAT', template: 'dx_lt_humerus_ap_lateral'},
      {label: 'XRAY RT HUMERUS AP LAT', template: 'dx_rt_humerus_ap_lateral'},
      {label: 'XRAY LT SHOULDER AP LAT', template: 'dx_lt_shoulder_ap_lateral'},
      {label: 'XRAY RT SHOULDER AP LAT', template: 'dx_rt_shoulder_ap_lateral'},
      {label: 'XRAY LT WRIST AP LAT', template: 'dx_lt_wrist_ap_lateral'},
      {label: 'XRAY RT WRIST AP LAT', template: 'dx_rt_wrist_ap_lateral'},
      {label: 'XRAY LT HAND AP OBLIQUE', template: 'dx_lt_hand_ap_oblique'},
      {label: 'XRAY RT HAND AP OBLIQUE', template: 'dx_rt_hand_ap_oblique'},
    ],
    'LEG': [
      {label: 'XRAY BOTH KNEES AP LAT (OA)', template: 'dx_both_knees_op_lat_oa'},
      {label: 'XRAY BOTH KNEES AP (OA)', template: 'dx_both_knees_ap_oa'},
      {label: 'XRAY BOTH KNEES (OA)', template: 'dx_both_knees_oa'},
      {label: 'XRAY BOTH KNEES', template: 'dx_both_knees'},
      {label: 'XRAY LT ANKLE', template: 'dx_lt_ankle'},
      {label: 'XRAY RT ANKLE', template: 'dx_rt_ankle'},
      {label: 'XRAY LT FEMUR', template: 'dx_lt_femur'},
      {label: 'XRAY RT FEMUR', template: 'dx_rt_femur'},
      {label: 'XRAY LT HIP', template: 'dx_lt_hip'},
      {label: 'XRAY RT HIP', template: 'dx_rt_hip'},
      {label: 'XRAY LT HIP(THR)', template: 'dx_lt_hip_thr'},
      {label: 'XRAY RT HIP(THR)', template: 'dx_rt_hip_thr'},
      {label: 'XRAY LT KNEE', template: 'dx_lt_knee'},
      {label: 'XRAY RT KNEE', template: 'dx_rt_knee'},
      {label: 'XRAY LT KNEE(TKR)', template: 'dx_lt_knee_tkr'},
      {label: 'XRAY RT KNEE(TKR)', template: 'dx_rt_knee_tkr'},
      {label: 'XRAY LT KNEE (OA)', template: 'dx_lt_knee_oa'},
      {label: 'XRAY RT KNEE (OA)', template: 'dx_rt_knee_oa'},
      {label: 'XRAY LT LEG', template: 'dx_lt_leg'},
      {label: 'XRAY RT LEG', template: 'dx_rt_leg'},
      {label: 'XRAY LT FOOT', template: 'dx_lt_foot'},
      {label: 'XRAY RT FOOT', template: 'dx_rt_foot'},
    ]
  }
}

const ConvertStringToDate = (dateTimeString) => {
  if(!dateTimeString) return "";
  const year = dateTimeString.substring(0, 4);
  const month = dateTimeString.substring(4, 6) - 1; // Month is zero-based in JavaScript Date objects
  const day = dateTimeString.substring(6, 8);

  // Extract hour, minute, and second from the time string
  const hour = dateTimeString.substring(8, 10);
  const minute = dateTimeString.substring(10, 12);
  const second = dateTimeString.substring(12, 14);

  // Create a Date object
  const combinedDate = new Date(year, month, day, hour, minute, second);
  return combinedDate;
}

const getAgeFromDOB = (dobString) => {
  //tabnine- calculate age from dob - dob is like '19920323' in YYYYMMDD  format
  // Parse the date string in YYYYMMDD format
  const year = parseInt(dobString.substring(0, 4), 10);
  const month = parseInt(dobString.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript Date
  const day = parseInt(dobString.substring(6, 8), 10);

  // Create a date object for the DOB
  const dob = new Date(year, month, day);

  // Get today's date
  const today = new Date();

  // Calculate the difference in time
  const diffInMilliseconds = today - dob;

  // If the difference is negative, return an error
  if (diffInMilliseconds < 0) {
    return "Invalid DOB: Future date provided.";
  }

  // Calculate total days
  const totalDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  // Return age in days if less than a month
  if (totalDays < 30) {
    return `${totalDays} days`;
  }

  // Calculate total months
  const totalMonths =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    today.getMonth() -
    dob.getMonth() -
    (today.getDate() < dob.getDate() ? 1 : 0);

  // Return age in months if less than a year
  if (totalMonths < 12) {
    return `${totalMonths} months`;
  }

  // Calculate years
  let years = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    years--;
  }

  return `${years} years`;
}

const PatientHeader = (patDetails, currentReport, orderDetails) => {
  const age = getAgeFromDOB(patDetails.pat_dob);
  return (
    `<div style="border: 1px solid; width: 90%; font-size: 12px; margin: auto; padding: 10px">
      <div style="display: flex; margin-bottom: 4px">
        <div style="flex: 1">Patient Name: <strong>${patDetails.pat_name}</strong></div>
        <div style="flex: 1"> Sex / Age: <strong>${patDetails.pat_sex} / ${age}</strong></div>
      </div>
      <div style="display: flex;  margin-bottom: 4px">
        <div style="flex: 1">YH No: <strong>${patDetails.pat_pin}</strong></div>
        <div style="flex: 1">Acc No: <strong>${orderDetails.po_acc_no}</strong></div>
      </div>
      <div style="display: flex;  margin-bottom: 4px">
        <div style="flex: 1">Ref Phys. : <strong>${orderDetails.po_ref_doc}</strong></div>
        <div style="flex: 1">Modality: <strong>${orderDetails.po_modality}</strong></div>
      </div>
      <div style="display: flex;  margin-bottom: 4px">
        <div style="flex: 1">Order Date/Time: <strong>${moment(orderDetails.po_req_time).format('DD/MM/YYYY HH:mm:ss')}</strong></div>
        <div style="flex: 1">IP No: <strong>${orderDetails.po_adm_no|| '-'}</strong></div>
      </div>
      <div style="display: flex;  margin-bottom: 4px">
        <div style="flex: 1">Report Date/Time: <strong>${moment(currentReport.created_at).format("DD/MM/YYYY HH:mm:ss")}</strong></div>
        <div style="flex: 1">Reg Type: <strong>OPD</strong></div>
      </div>
    </div>`
  )
}

const ReportFooter = `
<div style="font-size: 12px; width: 90%; margin: auto">
  Note: This is a professional opinion only, Each investigation has its limitations. Final diagnosis needs correlation
  with clinical context and other investigations. Kindly discuss, if necessary.
</div>`;

const convertToTimestamp = (dateInput) => {
  return moment(dateInput, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ssZ');
}

module.exports = {NodesAndTemplates, PatientHeader, ReportFooter, convertToTimestamp}