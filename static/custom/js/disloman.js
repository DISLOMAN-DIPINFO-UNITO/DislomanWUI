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
    // var JSONMessage= {message: "Prova2", timestamp: 414342423};
    // var JSONStringMessage = JSON.stringify(JSONMessage);
    // var dataFormArrayObject = $("#orchestaFormData").serializeArray();
    // var dataFormString = JSON.stringify(dataFormArrayObject);

    $("#oeeComputationResponse").hide();
    $("#ingestionResponseJSON").hide();

    $("#orchestaSubmitData").click(function (e) {
        var formDataJSONObject = getFormData($("#orchestaFormData"));
        console.log(formDataJSONObject);
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


    $("#ssbRetriveData").click(function (e) {
        var messageElement= "<li id=\"\">" +
            "<a><span class=\"image\"><img src=\"../static/images/profile.jpg\" alt=\"img\"></span>" +
            "<span>" +
            "<span>Maurizio Ferrero</span>" +
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


