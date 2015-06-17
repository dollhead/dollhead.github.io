        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

$(function() {
	var lang = getParameterByName('lang');
	var body = "";
	if(lang = 'en') {
		$.get("engbody.html", function(data) {
			body = data;
		});
	}
	else {
		$.get("ukrbody.html", function(data) {
			body = data;
		});		
	}
	$('#body-content').html(body);
});