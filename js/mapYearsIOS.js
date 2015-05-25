//map displaying
var map = L.map('map').setView([50.4500, 30.5000], 13).setMaxBounds([
    [50.3281, 30.3092],
    [50.5411, 30.7432]]);
L.tileLayer('Tiles/{z}/{x}/{y}.png', {
    maxZoom: 15,
    minZoom: 11,
    detectRetina: true
}).addTo(map);

//Parse service
$(document).ready(function () {
    Parse.initialize("V1zs2pK88Po9XhEipDGkO0hYRzFjYPDJbZxE4jqk", "HWEk9coRYOLTRsIaBqyv7T6LqHVpiIPKCf1HXZko");
});

//Find object on click
map.on('click', function (e) {
    var lat = e.latlng.lat,
        lon = e.latlng.lng;

    $.getJSON("http://geocode-maps.yandex.ru/1.x/?callback=?",
        {
            geocode: lon + "," + lat,
            kind: "house",
            results: 1,
            format: "json"
        },
        function (json) {
            var name = json.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            var nameBuilding = json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
            //request to Parse
            var UniqueBuilding = Parse.Object.extend("UniqueBuilding");
            var query = new Parse.Query(UniqueBuilding);
            query.equalTo("address_text", nameBuilding);

            // JavaScript to send an action to your Objective-C code
            //var myAppName = 'ios://dollhead.github.io/KyivBuildingsForIOS';
            //var myActionType = 'buildingClick';
            //var myActionParameters = {address: full_name, year:""}; // put extra info into a dict if you need it

            query.first({
                success: function (obj) {
                    if (!obj) return;
                    console.log(obj);
                    var year = obj.get('year');
                    $("#year").text(year);
                    //myActionParameters.year = year;
                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
            // (separating the actionType from parameters makes it easier to parse in ObjC.)
            //var jsonString = (JSON.stringify(myActionParameters));
            //var escapedJsonParameters = escape(jsonString);
            //var url = myAppName + '://' + myActionType + "#" + escapedJsonParameters;
            //window.location = url;
            window.location.hash = "#building_data";
        });
        
});
function LocateToAddress(address) {
    $.getJSON("http://geocode-maps.yandex.ru/1.x/?callback=?",
        {
            geocode: "Киев " + address,
            results: 1,
            format: "json"
        },
    function (json) {
        var pos = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ");
        LocateToCoords(pos[1], pos[0]);
    });
}

function LocateToCoords(lat, lng) {
    map.setView([lat, lng], 15);
}

function lastBuilding() {
    return $("#year").text();
}