var DataTypes = require("sequelize").DataTypes;
var _patient_order = require("./patient_order");

function initModels(sequelize) {
  var patient_order = _patient_order(sequelize, DataTypes);


  return {
    patient_order,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
