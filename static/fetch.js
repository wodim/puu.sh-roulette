function disable() { $("#buzz").attr("disabled", "disabled"); }
function enable() { $("#buzz").removeAttr("disabled"); $("#buzz").html("Another one!"); }
$("#anchor").load(function() {
    enable();
});
$(document).ready(function() {
    $("#buzz").bind("click", function() {
        $("#errors").html("");
        $("#advice").html("Asking for a new image...");
        $("#target").attr("src", "/static/spinner.gif");
        disable();
        /* por si acasi se cuelga demasiado */
        setTimeout("enable()", 5000);
        var query = "/random/";
        $.getJSON(query, function(json) {
            /* por si se cuelga un poquito */
            $("#buzz").html("Still loading...");
            setTimeout("enable()", 1000);
            if (json.error) {
                $("#target").css("display", "none");
                $("#advice").html("Try again.");
                $("#target_anchor").attr("href", "#");
                $("#target").attr("src", "/static/error.gif");
            } else {
                $("#target").css("display", "inline");
                $("#advice").html("Loading image... " + json.image.size + "KB");
                $("#target_anchor").attr("href", json.image.url);
                $("#target").attr("src", json.image.url);
            }
            if (json.errors.length) {
                $("#errors").html("<strong>Previous errors:</strong>");
            }
            for (index = 0; index < json.errors.length; ++index) {
                my_url = json.errors[index].url;
                my_err = json.errors[index].error;
                $("#errors").html($("#errors").html() + "<br /><a href=\"" + my_url + "\" target=\"_blank\">" + my_url + "</a> - " + my_err);
            }
        });
    });

    $("#email").html(atob("d29kaW1Adm9ydGlnYXVudC5uZXQ="));
});