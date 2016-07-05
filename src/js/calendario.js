var $ = require("jquery");

var addDiaSinClase = function() {
  var btnDiaSinClase = $("#sinclase"),
    listaSinClase = $("#listasinclase"),
    fechaSinClase = $("#fechasinclase"),
    motivoSinClase = $("motivosinclase");

  $(btnDiaSinClase).on("click", function() {
    var motivo = $("#motivosinclase option:selected").val();
    var fecha = $(fechaSinClase).val();
    var value = fecha + "&" + motivo;
    var motivoTxt = $("#motivosinclase option:selected").text();
    $(listaSinClase).append("<li>" + fecha + " " + motivoTxt + "</li><input type='hidden' name='diasinclase[]' value=" + value + " class='inputDiaSinClase'/>");
  });
}

var addSE = function() {
  var btnAdd = $("#btnSE"),
    lista = $("#listasSE"),
    fechaIni = $("#fechaSE")
  motivos = $("motivosSE");

  $(btnAdd).on("click", function() {
    var motivo = $("#motivosSE option:selected").val();
    var fechaInicial = $(fechaIni).val();
    var value = fechaInicial + "&" + motivo;
    var motivoTxt = $("#motivosSE option:selected").text();
    $(lista).append("<li> Inicio: " + fechaInicial + " " + motivoTxt + "</li><input type='hidden' name='SE[]' value=" + value + " class='inputSE'/>");
  });
}

var addPHE = function() {
  var btnAdd = $("#btnPHE"),
    lista = $("#listasPHE"),
    fechaIni = $("#fechaIniPHE"),
    fechaFin = $("#fechaFinPHE"),
    motivos = $("motivosPHE");

  $(btnAdd).on("click", function() {
    var motivo = $("#motivosPHE option:selected").val();
    var fechaInicial = $(fechaIni).val();
    var fechaFinal = $(fechaFin).val();
    var value = fechaInicial + "&" + fechaFinal + "&" + motivo;
    var motivoTxt = $("#motivosPHE option:selected").text();
    $(lista).append("<li> Inicio: " + fechaInicial + " Fin: " + fechaFinal + " " + motivoTxt + "</li><input type='hidden' name='phe[]' value=" + value + " class='inputPHE'/>");
  });
}

var addIntDias = function() {
  var btnAdd = $("#btnIntDias"),
    lista = $("#listasIntDias"),
    fechaIni = $("#fechaIntDias")
  motivos = $("motivosIntDias");

  $(btnAdd).on("click", function() {
    var motivo = $("#motivosIntDias option:selected").val();
    var fechaInicial = $(fechaIni).val();
    var value = fechaInicial + "&" + motivo;
    var motivoTxt = $("#motivosIntDias option:selected").text();
    $(lista).append("<li> Inicio: " + fechaInicial + " " + motivoTxt + "</li><input type='hidden' name='IDias[]' value=" + value + " class='inputIntDias'/>");
  });
}

var normalizeDate = function(mydate) {
  var newDate = new Date(mydate);
  var posDay = newDate.getDay();

  mydate = mydate.split('-').join('/');

  var day = "MON";
  switch (posDay) {
    case 1:
      day = "MON";
      break;
    case 2:
      day = "TUE";
      break;
    case 3:
      day = "WED";
      break;
    case 4:
      day = "THU";
      break;
    case 5:
      day = "FRI";
      break;
    case 6:
      day = "SAT";
    case 0:
      day = "SUN";
      break;
    default:
      day = "MON";
  }
  return mydate + " " + day;
}

var normalizeIntDias = function(valor) {
  valor = valor.split("&");
  var fecha = valor[0],
    motivo = valor[1];
  obj = {
    "diaPorQueSeCambia": motivo,
    "diaOriginal": normalizeDate(fecha)
  }
  return obj;
}

var normalizeDSC = function(valor) {
  valor = valor.split("&");
  var fecha = valor[0],
    motivo = valor[1];

  switch (motivo) {
    case "FN":
      motivo = "FiestaNacional";
      break;
    case "FL":
      motivo = "FiestaLocal";
      break;
    case "FA":
      motivo = "FiestaAutonomica";
      break;
    case "DSC":
      motivo = "NoPresencial";
      break;
    default:
      motivo = "NoPresencial";
  }

  obj = {
    "motivo": motivo,
    "fecha": normalizeDate(fecha)
  }
  return obj;
}

var normalizePHE = function(valor) {
  valor = valor.split("&");
  var fechaIni = valor[0],
    fechaFin = valor[1],
    motivo = valor[2];
  switch (motivo) {
    case "HA":
      motivo = "HorarioAgrupado";
      break;
    case "FT":
      motivo = "FinDeTrabajos";
      break;
    case "EX":
      motivo = "Examenes";
      break;
    default:
      motivo = "";
  }

  obj = {
    "fechaInicio": normalizeDate(fechaIni),
    "fechaFin": normalizeDate(fechaFin),
    "motivo": motivo
  }

  return obj;
}

var normalizeSE = function(valor) {
  valor = valor.split("&");
  var fecha = valor[0],
    motivo = valor[1];

  switch (motivo) {
    case "PA":
      motivo = "Pascua";
      break;
    case "PT":
      motivo = "Puente";
      break;
    case "NV":
      motivo = "Navidad";
      break;
    default:
      motivo = "";
  }

  obj = {
    "motivo": motivo,
    "primerDiaSemana": normalizeDate(fecha)
  }
  return obj;
}

var descargarCalendario = function(data) {
  var loadingDiv = $(".loading")[0]; //Cacheo el el bloque donde ira el loading

  var textFile = null,
    makeTextFile = function(text) {
      var data = new Blob([text], {
        type: 'text/plain'
      });


      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      return textFile;
    };


    $(loadingDiv).removeClass("hidden");
    var link = document.getElementById('downloadlink');
    var url = "/calendarioanual";
    var success = function(data) { //Si todo tira bien se ejecuta esto
      link.href = makeTextFile(data["calendario"]);
      link.style.display = 'block';
      $(loadingDiv).addClass("hidden", 500);
    };

    var error = function(request, status, error) { //Si hay algun error pues esto
      console.log(request);
      console.log(request.responseText);
      $(loadingDiv).addClass("hidden", 500);
      alert("Error, mira la consola para ver los logs");
    };

    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      success: success,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: error
    });

}


var generarCalendario = function() {
  var btnSubmit = $("#submitCalendar");

  $(btnSubmit).on("click", function() {

    calendario = {};

    //Incluir todos los dias sin clase
    var aDiasSinClase = [];
    var sinclase = $(".inputDiaSinClase");
    $(sinclase).each(function() {
      aDiasSinClase.push(normalizeDSC($(this).val()));
    });
    calendario["diasSinClase"] = aDiasSinClase;

    //Incluir horario especial
    var aPHE = [];
    var phe = $(".inputPHE");
    $(phe).each(function() {
      aPHE.push(normalizePHE($(this).val()));
    });
    calendario["periodosHorarioEspecial"] = aPHE;

    //Incluir semanas excluidas
    var aSE = [];
    var se = $(".inputSE");
    $(se).each(function() {
      aSE.push(normalizeSE($(this).val()));
    });
    calendario["semanasExcluidas"] = aSE;

    //Incluir intercambio dias
    var aIDias = [];
    var se = $(".inputIntDias");
    $(se).each(function() {
      aIDias.push(normalizeIntDias($(this).val()));
    });
    calendario["intercambioDias"] = aIDias;

    //Valores por defecto del calendario
    calendario["diasSemanalesNoLectivos"] = ["SA", "SU"];
    calendario["cursoAcademico"] = "2016/2017";
    calendario["inicioCuatrimestreUno"] = normalizeDate("2016-09-05");
    calendario["inicioCuatrimestreDos"] = normalizeDate("2017-01-23");
    calendario["finCuatrimestreUno"] = normalizeDate("2016-12-23");
    calendario["finCuatrimestreDos"] = normalizeDate("2016-05-19");

    var jsonPretty = JSON.stringify(calendario);
    descargarCalendario(jsonPretty);
    console.log(jsonPretty);
  });

}

exports.addIntDias = addIntDias;
exports.addSE = addSE;
exports.addPHE = addPHE;
exports.generarCalendario = generarCalendario;
exports.addDiaSinClase = addDiaSinClase;
