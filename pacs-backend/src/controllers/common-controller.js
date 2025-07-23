const { USERS, USER_PERMISSIONS, PERMISSIONS_MASTER, UNITS_MASTER, ROLES_MASTER, STATUS_MASTER, DISEASES_MASTER, CRITICAL_NOTIFICATIONS, MODALITY_MASTER, REPORT_TEMPLATES } = require("../models");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../database");
require("dotenv").config();

const encodePwd = (strPwd) => {
  let resultWord = "";
  const pwdLen = strPwd.length;
  for (let i = 0; i < strPwd.length; i++) {
    const char = strPwd.charAt(i);
    const asciiValue = char.charCodeAt(0); // Get ASCII value of the character
    const newAsciiValue = asciiValue + pwdLen;
    const newChar = String.fromCharCode(newAsciiValue); // Convert the new ASCII value back to a character
    resultWord += newChar;
  }
  return resultWord;
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const db_user = await USERS.findAll({
      where: { username },
      raw: true,
    });
    const user = db_user[0];
    const encoded_pwd = encodePwd(password);

    if (user?.user_password === encoded_pwd) {
      let final_response = {};
      const {user_signature, ...other_fields} = user;

      const access_token = jwt.sign(other_fields, process.env.JWT_SECRET);
      delete user.user_password;

      final_response = {
        username,
        access_token,
        success: true,
        user_details: user,
      };

      return res.status(200).send({
        message: "Login Successful",
        data: final_response,
      });
    } else {
      return res.status(500).send({
        message: "Username or password is incorrect",
        data: {
          success: false,
        },
      });
    }
  } catch (e) {
    console.log("error", e);
    return res
      .status(500)
      .send({ message: "Something went wrong", error: e.message });
  }
};

const addUser = async (req, res) => {
  const {
    user_firstname,
    user_lastname,
    username,
    password,
    user_designation,
    user_mobile,
    user_email,
    user_type,
    user_unit_name,
    user_degree,
    user_signature,
    permissions,
    user_id,
    existing_user_id,
  } = req.body;

  try {
    if (username) {
      const usernameExists = await USERS.findAll({
        where: { username },
        raw: true,
      });

      // On new user create, check for username clash
      if (!existing_user_id && usernameExists?.length > 0) {
        return res.status(200).send({ success: false, message: 'Username already taken' });
      }
    }

    // Update flow
    if (existing_user_id) {
      const existingUser = await USERS.findByPk(existing_user_id);
      if (!existingUser) {
        return res.status(404).send({ success: false, message: 'User not found' });
      }

      const fieldMapping = {
        user_firstname,
        user_lastname,
        username,
        user_email,
        user_mobile,
        user_type,
        user_designation,
        user_unit_name,
        user_degree,
        user_signature,
      };

      const updateData = Object.entries(fieldMapping)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (user_firstname && user_lastname) {
        updateData.user_fullname = `${user_firstname} ${user_lastname}`;
      }

      if (password) {
        updateData.user_password = encodePwd(password);
      }

      if (user_id) {
        updateData.user_created_by = user_id;
      }

      updateData.user_created_dt = Sequelize.literal('CURRENT_TIMESTAMP');

      await USERS.update(updateData, {
        where: { user_id: existing_user_id },
      });

      return res.status(200).send({ message: 'User updated successfully', success: true });
    }

    // Create flow
    const user_inserted = await USERS.create({
      username,
      user_fullname: `${user_firstname} ${user_lastname}`,
      user_firstname,
      user_lastname,
      user_password: encodePwd(password),
      user_email,
      user_mobile,
      user_created_dt: Sequelize.literal('CURRENT_TIMESTAMP'),
      user_type,
      user_designation,
      user_unit_name,
      user_degree,
      user_signature,
      user_created_by: user_id,
      is_active: 'Y',
    });

    for (const prm of permissions) {
      await USER_PERMISSIONS.create({
        up_username: username,
        up_type: 'SCREEN',
        up_label: prm,
        up_key: prm,
        up_unit: user_unit_name,
      });
    }

    return res.status(201).send({ message: 'User created successfully', success: true });
  } catch (e) {
    console.log('Error while adding or updating', e);
    return res.status(500).send({ message: e.message });
  }
};


const getPermissionsList = async(req, res) => {
  try {
    const permissions = await PERMISSIONS_MASTER.findAll({
      raw: true
    })
    return res.status(200).send({data: permissions})
  } catch(e) {
    console.log("Erro rpermissions lisy", e);
    
    return res.status(500).send({message: "Something went worng"})
  }
}

const getUnitsList = async(req, res) => {
  try {
    const units = await UNITS_MASTER.findAll({
      raw: true
    })
    return res.status(200).send({data: units})
  } catch(e) {
    console.log("asdad", e);
    return res.status(500).send({message: "Something went worng"})
  }
}

const getRolesList = async(req, res) => {
  try {
    const rolesList = await ROLES_MASTER.findAll({
      raw: true
    })
    return res.status(200).send({data: rolesList})
  } catch(e) {
    console.log("asdad", e);
    return res.status(500).send({message: "Something went worng"})
  }
}

const getStatusList = async(req, res) => {
  try {
    const statusList = await STATUS_MASTER.findAll({
      raw: true
    })
    return res.status(200).send({data: statusList})
  } catch(e) {
    return res.status(500).send({message: "Something went worng"})
  }
}

const deleteUser = async(req, res) => {
  const {username} = req.body;
  try {
    const updatedRec = await USERS.update({
      is_active: 'N',
    }, {
      where: {
        username: username
      }
    });
    return res.status(200).send({message: "User deactivated successfully", success: true});
  } catch(e) {
    return res.status(500).send({message: e.message});
  }
}

const getDoctorsList = async(req, res) => {
  const {} = req.body;
  try {
    const docList = await sequelize.query('SELECT * FROM "DOCTOR"', {raw: true, type: Sequelize.QueryTypes.SELECT, });
    return res.status(200).send({data: docList});
  } catch(e) {
    console.log("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

const getDiseasesList = async(req, res) => {
  const {} = req.body;
  try {
    const diseaseList = await DISEASES_MASTER.findAll({
      raw: true
    })
    return res.status(200).send({data: diseaseList});
  } catch(e) {
    console.log("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

const notifyPhysicians = async(req, res) => {
  const {doctors, disease, findings, user_id, order_id} = req.body;
  try {
    //step1:  send sms or email
    // step2: save notification log
    const isnerted = await CRITICAL_NOTIFICATIONS.create({
      cn_doc_ref_cds: doctors?.map(itm => itm.DOC_REF_CD).join(','),
      cn_doc_emails: doctors?.map(itm => itm.DOC_EMAIL).join(','),
      cd_doc_mobiles: doctors?.map(itm => itm.DOC_MOBILE_TEL).join(','),
      cn_disease: disease,
      cn_findings: findings,
      cn_triggered_by: user_id,
      cn_pacs_ord_id: order_id,
    });
    return res.status(200).send({message: 'Notified'});
  } catch(e) {
    console.log("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

const getModalities = async(req, res) => {
  try {
    const modalities = await MODALITY_MASTER.findAll({raw: true, where: {is_active: 'Y'}});
    return res.status(200).send({data: modalities?.map(itm => ({label: itm.modality_label, code: itm.modality_code}))});
  } catch(e) {  
    console.error("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

const getBodyParts = async(req, res) => {
  try {
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
    return res.status(200).send({data: parts});
  } catch(e) {  
    console.error("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

const saveTemplate = async(req, res) => {
  const {user_id, name, html, modality, body_part} = req.body;
  try {
    const inserted = await REPORT_TEMPLATES.create({
      rt_bodypart: body_part,
      rt_template_name: name,
      rt_display_name: name,
      template_html: html,
      rt_added: user_id,
      rt_modality: modality
    })
    return res.status(200).send({message: 'Template added successfully!', success: true});
  } catch(e) {  
    console.error("Error:", e);
    return res.status(500).send({message: e.message});
  }
}

module.exports = {
  notifyPhysicians, // modified

  login, // no need
  addUser, // no need
  getPermissionsList, //no need
  getUnitsList, // no need
  getRolesList, // no need
  getStatusList,
  deleteUser, // no need
  getDiseasesList, // no need
  getDoctorsList,  // no need
  getModalities, // no need
  getBodyParts, // mo need
  saveTemplate, // no need
}