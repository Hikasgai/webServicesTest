var $ = require("jquery");
require("jquery-ui");

var loadAsignaturas = function() {
  url = "/getAsignaturas";

  $.ajax({
    type: "POST",
    url: url,
    data: {},
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
      //TODO: Esta funcion es muy guarra, mañana la pongo bien pero para probar ahora vale
      var ulPrimero = "<ul class='primero'>";
      for(var i in data["1"]){
        ulPrimero += "<li><input type='checkbox' name='primero' value='"+ data["1"][i]['codigo'] +"' />" + data["1"][i]['nombreAsignatura'] + "</li>";
      }
      ulPrimero += "</ul>";
      var ulSegundo = "<ul class='segundo'>";
      for(var i in data["2"]){
        ulSegundo += "<li><input type='checkbox' name='segundo' value='"+ data["2"][i]['codigo'] +"' />" + data["2"][i]['nombreAsignatura'] + "</li>";
      }
      ulSegundo += "</ul>";
      var ulTercero = "<ul class='tercero'>";
      for(var i in data["3"]){
        ulTercero += "<li><input type='checkbox' name='tercero' value='"+ data["3"][i]['codigo'] +"' />" + data["3"][i]['nombreAsignatura'] + "</li>";
      }
      ulTercero += "</ul>";
      var ulCuarto = "<ul class='cuarto'>";
      for(var i in data["4"]){
        ulCuarto += "<li><input type='checkbox' name='cuarto' value='"+ data["4"][i]['codigo'] +"' />" + data["4"][i]['nombreAsignatura'] + "</li>";
      }
      ulCuarto += "</ul>";
      var ulOptativas = "<ul class='optativas'>";
      for(var i in data["X"]){
        ulOptativas += "<li><input type='checkbox' name='optativas' value='"+ data["X"][i]['codigo'] +"' />" + data["X"][i]['nombreAsignatura'] + "</li>";
      }
      ulOptativas += "</ul>";
      $("#asignaturasprimero").append(ulPrimero);
      $("#asignaturassegundo").append(ulSegundo);
      $("#asignaturastercero").append(ulTercero);
      $("#asignaturascuarto").append(ulCuarto);
      $("#asignaturasoptativas").append(ulOptativas);
    },
    error: function() {
      console.log("Error al cargar las asignatuas");
    }
  });
};

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

var generarHorario = function() {
  var loadingDiv = $(".loading")[0];
  $("#btnAsignaturas").on("click", function() {
    $(loadingDiv).removeClass("hidden");
    var data = {};
    data["1"] = [];
    data["2"] = [];
    data["3"] = [];
    data["4"] = [];
    data["X"] = [];

    $("input:checkbox[name=primero]:checked").each(function(){
    data["1"].push($(this).val());
    });
    $("input:checkbox[name=segundo]:checked").each(function(){
    data["2"].push($(this).val());
    });
    $("input:checkbox[name=tercero]:checked").each(function(){
    data["3"].push($(this).val());
    });
    $("input:checkbox[name=cuarto]:checked").each(function(){
    data["4"].push($(this).val());
    });
    $("input:checkbox[name=optativas]:checked").each(function(){
    data["X"].push($(this).val());
    });
    var jsonPretty = JSON.stringify(data);
    url = "/obtenergrupos";
    var link = document.getElementById('downloadlink');
    console.log(jsonPretty);
    $.ajax({
      type: "POST",
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      url: url,
      data: jsonPretty,
      success: function(data) {
        console.log("Calendario generado");
        console.log(data);
        link.href = makeTextFile(data["calendario"]);
        link.style.display = 'block';
        $(loadingDiv).addClass("hidden", 500);

      }
    });

  });

};


var escogerAsignatura = function() {
  loadAsignaturas();
  generarHorario();
};


exports.escogerAsignatura = escogerAsignatura;
