
var dataName = "DATE	TIME	TIMESTAMP	DI12	DI13	DI4	DI3	AI1	DI1		DI2		TotDI12	TotDI13	ALMGenerico	DI4NEQ0".split("\t");
var data1    = "16/04/2018	11:18:03	16/04/2018 11:18	7	0	1	0	39439	1111010	0	1111010	1	7	0	0	1".split("\t");
var data2	 = "16/04/2018	11:18:29	16/04/2018 11:18	7	7	0	0	14595	1110010	0	1110010	1	14	13	0	0".split("\t");
var data3	 = "16/04/2018	11:18:06	16/04/2018 11:18	0	6	1	0	40673	1110010	0	1110010	1	7	6	0	1".split("\t");

var JSONtoSend;

var btn = "<div>"+
	"<button id=\"submitCorkigLog\" type=\"button\" class=\"btn btn-success\">Invia dati</button>"+"</div>"

function corkingLogsJSONToText(json){
	corkinglogsJSON = json["_embedded"]["corkinglogs"];

	var html = "";
    for (var i = 0; i < corkinglogsJSON.length; i++) {
        html+="<p><b>LOG</b> " + (i+1) +"<br>";
        html+=("<span><b>INFO:</b> " + JSON.stringify(corkinglogsJSON[i]["info"]) +"</span><br>");
        for (var j = 0; j < dataName.length; j++) {
            if(corkinglogsJSON[i].hasOwnProperty(dataName[j])){
                html+=("<span><b>"+dataName[j]+"</b>: " + JSON.stringify(corkinglogsJSON[i][dataName[j]]) +"</span><br>");
            }
        }
        html+="</p>";
    }
    return html;
}

function switchMode() {
  var messageSend = document.getElementById("send-message-div");
  var messageGet = document.getElementById("get-message-div");
  var corkingLogSend = document.getElementById("send-corkinglog-div");
  var corkingLogGet = document.getElementById("get-corkinglog-div");

  if (messageGet.style.display === "none") {
    messageSend.style.display = "block";
    messageGet.style.display = "block";
    corkingLogSend.style.display = "none";
    corkingLogGet.style.display = "none";
	$("#switch-mode").html('Messagge mode');
    //corkingLog.style.display = "none";
  } else {
    messageSend.style.display = "none";
    messageGet.style.display = "none";
    corkingLogSend.style.display = "block";
    corkingLogGet.style.display = "block";
	$("#switch-mode").html('Corking log mode');
    //corkingLog.style.display = "block";
  }
}

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function fillOeeComputationMessagesList(data,messageElement) {
    // console.log(data);
   $("#oeeComputationMessagesList").text("");
    $.each(data, function(i, item) {
        // Inserico un nuovo HTML message element
        $("#oeeComputationMessagesList").append(messageElement);
        //  Vado a riempire il nuovo HTML message element con i valori restituiti dall'oeeComputationService
        $("#oeeComputationMessagesList li:last-child span.timestamp").text(item.timestamp);
        $("#oeeComputationMessagesList li:last-child span.message").text(item.message);
        var urlParts = item._links.self.href.split("/");
        var id = urlParts[urlParts.length-1];
        $("#oeeComputationMessagesList li:last-child").attr("id",id);
    })
}

$(document).ready(function() {

  var corkingLogSend = document.getElementById("send-corkinglog-div");
  var corkingLogGet = document.getElementById("get-corkinglog-div");
  $("#switch-mode").html('Message mode');

  corkingLogSend.style.display = "none";
  corkingLogGet.style.display = "none";
    var message1 = [];
	var logJSON = JSON.parse("{}");

  	$("#corkinglog").html("<p>CORKING LOG</p><p>");
	
	for(var i=0;i<dataName.length;i++)
		dataName[i] = dataName[i].toLowerCase();

	var logData;
    for (var i=0;i<data1.length;i++){
		logData=data1[i];
        if((dataName[i].match(/\w/) !== null)){
            console.log(dataName[i]+":" + logData);
			logJSON[dataName[i]]=logData;
			$("#corkinglog").append("<b>"+dataName[i]+"</b>"+" : "+logData+"</br>");
        }
    }

	$("#corkinglog").append("</p>"+btn);
	JSONtoSend = logJSON;
	$("#JSON-corkinglog-request").html(JSON.stringify(logJSON,null,2));

    // var JSONMessage= {message: "Prova2", timestamp: 414342423};
    // var JSONStringMessage = JSON.stringify(JSONMessage);
    // var dataFormArrayObject = $("#orchestaFormData").serializeArray();
    // var dataFormString = JSON.stringify(dataFormArrayObject);

    $("#oeeComputationResponse").hide();
    $("#ingestionResponseJSON").hide();

	$("#submitCorkigLog").click(function (e) {
        var formDataJSONObject = JSONtoSend;

        console.log(formDataJSONObject);

        var formDataJSONString = JSON.stringify(formDataJSONObject);
        console.log("JSON data to send: "+formDataJSONString);

        $.ajax({
            url: "https://disloman/api/orchestra/corkinglogs",
            // url: "http://192.168.99.100:8080/api/orchestra/greetings/",
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: formDataJSONString,
            success: function (data) {
                console.log("DATA POSTED SUCCESSFULLY!");
                console.log(data)
                $("#corkinglog-response").html(JSON.stringify(data,null,2));
                // console.log("JSONMessage "+JSONMessage);
                // console.log("JSONStringMessage "+JSONStringMessage);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("ERROR DATA POSTED!");
                console.log(errorThrown);
            }
        });
    });

    $("#orchestaSubmitData").click(function (e) {
        var formDataJSONObject = getFormData($("#orchestaFormData"));
        console.log(formDataJSONObject);
	formDataJSONObject["uselessinfo"] = "uselessinformation";
        var formDataJSONString = JSON.stringify(formDataJSONObject);
        console.log("JSON data to send: "+formDataJSONString);
        $("#ingestionResponseJSON").slideDown();
        $.ajax({
            url: "https://disloman/api/orchestra/greetings",
            // url: "http://192.168.99.100:8080/api/orchestra/greetings/",
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: formDataJSONString,
            success: function (data) {
                console.log("DATA POSTED SUCCESSFULLY!");
                console.log(data)
                $("#messageResponse").html(JSON.stringify(data,null,2));
                // console.log("JSONMessage "+JSONMessage);
                // console.log("JSONStringMessage "+JSONStringMessage);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("ERROR DATA POSTED!");
                console.log(errorThrown);
            }
        });
    });

	$("#ssb-get-corking").click(function (e) {
        $.ajax({
            url: "https://disloman/api/ssb/corkinglogs",
            // url: "http://192.168.99.100:8080/api/ssb/greetings/",
            type: 'GET',
            success: function (data) {
                console.log("DATA RETRIEVED SUCCESSFULLY!");
                // Inserisco i nuovi messaggi recuperati dall'oeeComputationService (WebUser-friendly-Interface)
			$("#oeeResponseMessageJSON").html("");
                //fillOeeComputationMessagesList(data["_embedded"]["greetings"]);
                // Visualizzo i dati restituiti dall'oeeComputationService sotto forma di JSON data
                $("#data-corkinglog").css("display", "block");
                $("#corkinglogs-list").html(corkingLogsJSONToText(data));
                $("#oeeResponseMessageJSON-corking").html(JSON.stringify(data["_embedded"]["corkinglogs"],null,2));
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("ERROR DATA RETRIEVED!");
                console.log(errorThrown);
            }
        });
        $("#oeeComputationResponse").slideDown();
    });

    $("#ssbRetriveData").click(function (e) {
        var messageElement= "<li id=\"\">" +
            "<a><span class=\"image\"><img src=\"../static/images/profile.jpg\" alt=\"img\"></span>" +
            "<span>" +
            "<span>Marco Scaletta</span>" +
            "<span class=\"time timestamp\"></span>" +
            "</span>" +
            "<span class=\"message\"></span>" +
            "</a>" +
            "</li>";
        $.ajax({
            url: "https://disloman/api/ssb/greetings",
            // url: "http://192.168.99.100:8080/api/ssb/greetings/",
            type: 'GET',
            success: function (data) {
                console.log("DATA RETRIEVED SUCCESSFULLY!");
                // Inserisco i nuovi messaggi recuperati dall'oeeComputationService (WebUser-friendly-Interface)
		$("#oeeResponseMessageJSON").html("");
                fillOeeComputationMessagesList(data["_embedded"]["greetings"],messageElement);
                // Visualizzo i dati restituiti dall'oeeComputationService sotto forma di JSON data
                $("#oeeResponseMessageJSON").html(JSON.stringify(data["_embedded"]["greetings"],null,2));
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log("ERROR DATA RETRIEVED!");
                console.log(errorThrown);
            }
        });
        $("#oeeComputationResponse").slideDown();
    });
});


