var hl7 = require('simple-hl7');
const { PACS_ORDERS, PATIENTS, ORDER_WORKFLOW } = require('../models');
const { convertToTimestamp } = require('../constants');
const { fetchPrevStudies } = require('./file-controller');
const moment = require('moment');


function printAllFields(segment, segmentName) {
  if (!segment) {
    console.log(`${segmentName} segment not found in the message`);
    return;
  }

  console.log(`\n=== ${segmentName} SEGMENT ===`);
  
  // Most HL7 libraries allow getting the field count
  const fieldCount = segment.getFieldCount ? segment.getFieldCount() : 30; // Using 30 as a fallback
  
  for (let i = 0; i < fieldCount; i++) {
    try {
      const fieldValue = segment.getField(i);
      // Only print fields that have values
      if (fieldValue && fieldValue.toString().trim() !== '') {
        console.log(`${segmentName}-${i}: ${fieldValue}`);
      }
    } catch (e) {
      // Field might not exist, just skip it
    }
  }
}

const insertPatData = async (msg) => { 
  try {
    const pid = msg.getSegment("PID");
    const pv1 = msg.getSegment("PV1");
    const orc = msg.getSegment("ORC");
    const obr = msg.getSegment("OBR");

    printAllFields(pid, "PID");
    printAllFields(pv1, "PV1");
    printAllFields(orc, "ORC");
    printAllFields(obr, "OBR");
    
    const pin = pid.getField(3);
    const pat_name = pid.getField(5);
    const pat_dob = pid.getField(7);
    const pat_sex = pid.getField(8);

    const pat_class = pv1.getField(2);
    const pat_location = pv1.getField(3);
    const visit_number = pv1.getField(19);

    const accession_no = obr.getField(2);
    const ord_details = obr.getField(3);
    const diag = obr.getField(4);
    const req_date = obr.getField(7);
    const ref_doc = obr.getField(16);
    const section_cd = obr.getField(24);

    const request_type = orc.getField(1);
    const req_user = orc.getField(10);

    const [diag_no, diag_desc] = diag.split('^');
    const [req_user_id, req_user_name] = req_user.split('^');
    const [ref_doc_cd, ref_doc_name] = ref_doc.split('^');

    const ord_no = ord_details.split('^')[0];

    const trimmed_desc = diag_desc?.toUpperCase()?.trim();

    console.log("INSIDE INSERTC PAT DATA",pin, diag_desc);
    
    if(trimmed_desc.includes('CT SCAN') || trimmed_desc.includes('BRAIN') || ['RC', 'PX'].includes(section_cd) || true) {
      if(request_type == 'NW') {

        let pat_pacs_id = null;
        const patExists = await PATIENTS.findOne({
          where: {
            pat_pin: pin
          },
          raw: true
        });

        if (!patExists) {
          const patCreated = await PATIENTS.create({
            pat_pin: pin,
            pat_name: pat_name.split('^').join(" "),
            pat_dob: pat_dob,
            pat_sex: pat_sex,
            pat_unit: 'SOMAJIGUDA', // TODO
          });
          pat_pacs_id = patCreated.pat_pacs_id;
        } else {
          pat_pacs_id = patExists.pat_pacs_id;
        }

        // const reqTime = convertToTimestamp(req_date);
        const reqTime = moment(req_date, 'YYYYMMDDHHmmss');
        const adjustedReqTime = reqTime.subtract(5, 'hours').subtract(30, 'minutes').toDate();

        const ordCreated = await PACS_ORDERS.create({
          po_his_ord_no: ord_no,
          po_pat_pacs_id: pat_pacs_id,
          po_acc_no: accession_no,
          po_ord_no: ord_no,
          po_diag_no: diag_no,
          po_diag_desc: diag_desc,
          po_req_time: adjustedReqTime,
          po_ref_doc_cd: ref_doc_cd,
          po_ref_doc: ref_doc_name,
          po_req_by_id: req_user_id,
          po_req_by_name: req_user_name,
          po_status: "PENDING",
          po_his_status: 'UNCONFIRMED',
          po_section_code: section_cd,
          po_pat_class: pat_class,
          po_pat_location: pat_location,
          po_visit_number: visit_number
        });

        const pacs_ord_id = ordCreated?.pacs_ord_id;

        const workflowCreated = await ORDER_WORKFLOW.create({
          ow_pacs_ord_id: pacs_ord_id,
          ow_pacs_status: 'PENDING'
        });

        // const inserted = await PATIENT_ORDER.create({
        //   po_pin: pin,
        //   po_pat_name: pat_name.split('^').join(" "),
        //   po_pat_dob: pat_dob,
        //   po_pat_sex: pat_sex,
        //   po_acc_no: accession_no,
        //   po_ord_no: ord_no,
        //   po_diag_no: diag_no,
        //   po_diag_desc: diag_desc,
        //   po_req_time: req_date,
        //   po_ref_doc_cd: ref_doc_cd,
        //   po_ref_doc: ref_doc_name,
        //   po_req_by_id: req_user_id,
        //   po_req_by_name: req_user_name,
        //   po_status: "PENDING",
        //   po_his_status: 'UNCONFIRMED',
        //   po_section_code: section_cd
        // });
        // await fetchPrevStudies({pin});
      } else if (request_type === 'CA') {
        const updated = await PACS_ORDERS.update({
          po_his_status: "CANCELLED"
        }, {
          where: {
            po_acc_no: accession_no,
            po_his_ord_no: ord_no
          }
        });
      }
    }
    
    return null;
  } catch(e) {
    console.log("ERROR WHIEL PARSING", e);
    return null;
  }
}


const sendHL7Message = async (req, res, next) => {
  ///////////////////CLIENT/////////////////////
  var client = hl7.Server.createTcpClient('localhost', 7777);

//   MSH|^~\&|HIS|SEC1|INSTAPACS||20240423184341||ORM^O01|62630|P|2.3|
// PID|||116374040||RAJITHA P1^^||19840101|F|||||||||||||||||||||
// PV1||O|^^|||||ANRRHESC01^DR. A N ROY||||||||||||||||||||||||||||||||||||00000000000000|00000000000000|
// ORC|NW|62630|||SC||||20240423184341|ED1021^SHYAM  RAO.B  ||||||||||||
// OBR||62630|557680^^O|2686^CT SCAN BRAIN PLAIN|||20240423184341|||||||||ANRRHESC01^DR. A N ROY||||||||RC||||||||||||20240423184341||

  //create a message
  var adt = new hl7.Message(
                      "EPIC",
                      "EPICADT",
                      "SMS",
                      "199912271408",
                      "CHARRIS",
                      ["ADT", "A04"], //This field has 2 components
                      "1817457",
                      "D",
                      "2.5"
                  );

  adt.addSegment("PID",
    "", //Blank field
    "",
    "116374040", //Multiple components
    "",
    ["RAJITHA P1", "", ""],
    "",
    "19840101",
    "F" //REPEATING FIELD
    //Keep adding arguments to add more fields
  );

  adt.addSegment("PV1",
    "", //Blank field
    "O",
    "", "", "","",
    ["ANRRHESC01", "", "DR. A N ROY"], //Multiple components
    "",
    "",
    "",
    //Keep adding arguments to add more fields
  );

  adt.addSegment("ORC",
    "NW", //Blank field
    "62630",
    "", "",
    "SC","", "","",
    "20240423184341",
    ["ED1021", "SHYAM  RAO.B"], //Multiple components
    "",
    "",
    "",
    //Keep adding arguments to add more fields
  );

  adt.addSegment("OBR",
    "", //Blank field
    "62630",
    ["557680", "O"],
    ["2686", "CT SCAN BRAIN PLAIN"], //Multiple components
    "",
    "",
    "20240423184341", "", "", "", "", "", "", "", "",
    ["ANRRHESC01", "DR. A N ROY"],"", "", "", "", "", "", "",
    "RC","", "", "", "", "", "", "","", "", "", "",
    "20240423184341", ""
  );


  // console.log('******sending message*****')
  client.send(adt, function(err, ack) {
  });

}

function setPidOfTheWebServer() {
  const checkPort5000Command = `lsof -i :4000 -t`;

  exec(checkPort5000Command, (checkErr, checkStdout, checkStderr) => {
    if (checkErr || checkStderr) {
      console.error(`Error checking processes on port 5000:`, checkErr || checkStderr);
      return;
    }
    const pidsOn5000 = checkStdout.split('\n').filter(pid => pid.trim());
    console.log("INITIAL SERVER PORT", pidsOn5000);
    global.INITIAL_SERVER_PORT = pidsOn5000;
  });
}

const parseMessage = async (req, res, next) => {
  var parser = new hl7.Parser({segmentSeperator: '\r'});

  var msg = parser.parse(req.msg.toString());
  await insertPatData(msg); // PENDING
  next();
}

module.exports = {
  parseMessage,
  sendHL7Message
}