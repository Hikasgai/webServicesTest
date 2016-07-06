var $ = require('jquery');
var cal = require("./calendario.js");
var asig = require("./asignaturas.js");

cal.addDiaSinClase();
cal.generarCalendario();
cal.addPHE();
cal.addSE();
cal.addIntDias();

asig.escogerAsignatura();
