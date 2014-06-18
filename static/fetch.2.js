pr = {
    form_enable: function() {
        $("#buzz").removeAttr("disabled");
        $("#buzz").html("Another one!");
        $("#buzz").focus();
    },
    form_disable: function() {
        $("#buzz").attr("disabled", "disabled");
    },
    fetch: function() {
        $("#errors").html("");
        $("#advice").html("Asking for a new image...");
        $("#target").attr("src", "/static/spinner.gif");
        pr.form_disable();
        /* por si se cuelga demasiado */
        setTimeout(pr.form_enable, 5000);
        $.getJSON("/random/", function(json) {
            /* por si se cuelga un poquito */
            $("#buzz").html("Still loading...");
            setTimeout(pr.form_enable, 1000);
            if (json.success) {
                $("#target").css("display", "inline");
                $("#advice").html("Loading image... " + json.image.size + "KB");
                $("#target_anchor").attr("href", json.image.url);
                $("#target").attr("src", json.image.url);
            } else {
                $("#target").css("display", "none");
                $("#advice").html("Try again.");
                $("#target_anchor").attr("href", "#");
                $("#target").attr("src", "/static/error.gif");
            }

            if (json.errors.length) {
                $("#errors").html("<strong>Previous errors:</strong>");
                for (index = 0; index < json.errors.length; ++index) {
                    var my_url = json.errors[index].url;
                    var my_err = json.errors[index].error;
                    $("#errors").html($("#errors").html() + "<br /><a href=\"" + my_url + "\" target=\"_blank\">" + my_url + "</a> - " + my_err);
                }
            }
        });
    },
};

$(document).ready(function() {
    $("#buzz").bind("click", pr.fetch);
    $("#buzz").focus();
    $("#anchor").load(pr.form_enable);
    $("#email").html(atob("d29kaW1Ab3V0bG9vay5jb20"));
});
