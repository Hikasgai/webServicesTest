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
      console.log("Asignaturas cargadas");
      console.log(data)
      $("#input-asignatura").autocomplete({
        source: data["asignaturas"],
        select: function(event, ui) {
          // Set autocomplete element to display the label
          this.value = ui.item.label;

          $("#misasignaturas").append("<li>" + ui.item.label + "</li><input type='hidden' class='addasig' value='" + ui.item.value + "'/>");
          $("#input-asignatura").val("");
          // Prevent default behaviour
          return false;
        }
      });
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
    var codigos = $(".addasig");
    items = []
    $(codigos).each(function() {
      obj = {}
      obj["codigoAsig"] = $(this).val();
      items.push(obj);
    });
    postdata = {}
    postdata["data"] = items;
    var jsonPretty = JSON.stringify(postdata);
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
