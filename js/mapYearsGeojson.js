//map displaying
var map = L.map('map').setView([50.4500, 30.5000], 13).setMaxBounds([
    [50.3281, 30.3092],
    [50.5411, 30.7432]]);

$.getJSON("../PriceForBuildings.geojson", function (data) {
    L.geoJson(data, {
        style: function(building) {
            var price = building.properties.MEDmed;
            if (price < 800) return { color: "#313695", fillOpacity: 1, opacity: 1, weight: 0};
            else if (price < 1000) return { color: "#4575B4", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 1250) return { color: "#74ADD1", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 1500) return { color: "#ABD9E9", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 2000) return { color: "#E0F3F8", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 2500) return { color: "#FFFFBF", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 3000) return { color: "#FEE090", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 4000) return { color: "#FDAE61", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 5000) return { color: "#F46D43", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price < 7000) return { color: "#D73027", fillOpacity: 1, opacity: 1, weight: 0 };
            else if (price > 7000) return { color: "#A50026", fillOpacity: 1, opacity: 1, weight: 0 };
            return { color: "#d3d3d3" }
        }
    }).addTo(map);
})
.fail(function() {
    console.log("fail");
});

L.control.locate({
    position: 'topleft',  // set the location of the control
    drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
    follow: false,  // follow the user's location

    showPopup: false, // display a popup when the user click on the inner marker
    strings: {
        title: "Показати моє місцезнаходження",  // title of the locate control
        outsideMapBoundsMsg: "Отакої! Ви знаходитеся поза межами цієї карти." // default message for onLocationOutsideMapBounds
    },
    locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
}).addTo(map);
L.control.fullscreen().addTo(map);


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
            var full_name = json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
            $("#address-val").text(name);
            $("#year-val").text('');

            //request to Parse
            var UniqueBuilding = Parse.Object.extend("UniqueBuilding");
            var query = new Parse.Query(UniqueBuilding);
            query.equalTo("address_text", full_name);
            query.first({
                success: function (obj) {
                    if (!obj) return;
                    console.log(obj);
                    var year = obj.get('year');
                    $("#year-val").text(year);

                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });


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
        map.setView([pos[1], pos[0]], 15);
    });
}
