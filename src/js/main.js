console.log("jnjkn")

var $ = require('jquery');
var cal = require("./calendario.js");


cal.addDiaSinClase();
cal.generarCalendario();
cal.addPHE();
cal.addSE();
cal.addIntDias();
$('input[type="date"]').val(new Date());
