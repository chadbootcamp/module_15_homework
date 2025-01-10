// Create the map object with a center and zoom level

let map = L.map("map").setView([20, 0], 2); // Center map on global coordinates




// Base maps

let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    maxZoom: 18,

    attribution: "© OpenStreetMap Contributors"

});




let topoMap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {

    maxZoom: 17,

    attribution: "Map data: © OpenTopoMap (CC-BY-SA)"

});




// Default map layer

streetMap.addTo(map);




// Overlay for earthquakes data

let earthquakes = new L.LayerGroup();




// Function to determine marker size based on magnitude

function markerSize(magnitude) {

    return magnitude * 4;

}




// Function to determine marker color based on depth

function markerColor(depth) {

    return depth > 90 ? "#ff5f65" :

           depth > 70 ? "#fca35d" :

           depth > 50 ? "#fdb72a" :

           depth > 30 ? "#f7db11" :

           depth > 10 ? "#dcf400" :

                        "#a3f600";

}




// Load earthquake data and add to the earthquakes layer

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {

    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {

            return L.circleMarker(latlng, {

                radius: markerSize(feature.properties.mag),

                fillColor: markerColor(feature.geometry.coordinates[2]), // Depth is the third coordinate

                color: "#000",

                weight: 0.5,

                opacity: 1,

                fillOpacity: 0.8

            });

        },

        onEachFeature: function (feature, layer) {

            layer.bindPopup(

                `<h3>Location: ${feature.properties.place}</h3>

                <hr>

                <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>

                <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`

            );

        }

    }).addTo(earthquakes);

});




// Overlay for tectonic plates data

let tectonicPlates = new L.LayerGroup();




// Load tectonic plates data and add to the tectonicPlates layer

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json").then(data => {

    L.geoJson(data, {

        style: {

            color: "#ff7800",

            weight: 2

        }

    }).addTo(tectonicPlates);

});




// Add both layers to the map initially

earthquakes.addTo(map);

tectonicPlates.addTo(map);




// Base layers object

let baseMaps = {

    "Street Map": streetMap,

    "Topographic Map": topoMap

};




// Overlay layers object

let overlayMaps = {

    "Earthquakes": earthquakes,

    "Tectonic Plates": tectonicPlates

};




// Add layer control to the map

L.control.layers(baseMaps, overlayMaps, {

    collapsed: false

}).addTo(map);




// Add legend to the map

let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {

    let div = L.DomUtil.create("div", "info legend");

    let depths = [-10, 10, 30, 50, 70, 90];

    let labels = [];




    div.innerHTML += "<h4>Depth (km)</h4>";




    for (let i = 0; i < depths.length; i++) {

        div.innerHTML +=

            '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +

            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');

    }

    return div;

};

legend.addTo(map);
