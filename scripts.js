var ottobaciasMontante;
var outorgasMontante;
var marker;

var statusOttobaciasMontante = false;
var statusOutorgas = false;

function selecaoMontante(feature, layer) {
    layer.on('click', function (e) {

        var cobaciaValue = feature.properties.cobacia_n;
        var cobaciaEdit = cobaciaValue;

        if(statusOttobaciasMontante == true) {
            map.removeLayer(ottobaciasMontante);
        };

        if(statusOutorgas == true) {
            map.removeLayer(outorgasMontante);
        };

        while (cobaciaEdit.length > 0 && (parseInt(cobaciaEdit.slice(-1)) % 2 !== 0 || cobaciaEdit.slice(-1) == 0)) {
            cobaciaEdit = cobaciaEdit.slice(0, -1);
        };
        
        ottobaciasMontante = L.Geoserver.wms('http://191.252.221.146:8080/geoserver/wms', {
            layers: 'hidrogis:ottobacias_AI_IG6_ISR',
            attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
            CQL_FILTER: "cobacia_n LIKE '"+cobaciaEdit+"%' AND cobacia_n >= '"+cobaciaValue+"'",
        });
        ottobaciasMontante.addTo(map);
        statusOttobaciasMontante = true;

        outorgasMontante = L.Geoserver.wms('http://191.252.221.146:8080/geoserver/wms', {
            layers: 'hidrogis:outorgas_AI_IG6_CNARH',
            attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
            CQL_FILTER: "cobacia_n LIKE '"+cobaciaEdit+"%' AND cobacia_n >= '"+cobaciaValue+"'",
        });
        outorgasMontante.addTo(map);
        statusOutorgas = true;

    });
}

var baseOpenStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    opacity: 0.5,
    attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var baseGoogleSatelite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    opacity: 0.7,
    attribution: '<a href="https://www.google.com/maps">Google Satélite</a>'
});

var baseGoogleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 22,
    opacity: 0.5,
    attribution: '<a href="https://www.google.com/maps">Google Streets</a>'
});

var ottotrechos = L.Geoserver.wms('http://191.252.221.146:8080/geoserver/wms', {
    layers: 'hidrogis:ottotrechos_AI_IG6',
    style: "estilo_ottotrechos_AI_IG6",
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
});

var ottobacias = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottobacias_AI_IG6',
    fitLayer: true,
    style: {
        color: "rgba(35, 150, 160, 1)",
        fillColor: "rgba(90, 199, 204, 1)",
        weight: "0.8",
    },
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
    onEachFeature: selecaoMontante,
});

var map = L.map('map', {
    center: [-16, -51.5],
    zoom: 4,
    layers: [baseOpenStreetMap, ottotrechos, ottobacias]
});

var baseMaps = {
    "OpenStreetMap": baseOpenStreetMap,
    "Google Satelite": baseGoogleSatelite,
    "Google Streets": baseGoogleStreets
};

var overlayMaps = {
    "Ottobacias": ottobacias,
    "Ottotrechos": ottotrechos
};

var layerControl = L.control.layers(baseMaps, overlayMaps);
layerControl.addTo(map);

statusOttotrechos = true;
statusOttobacias = true;

var limiteBacia = L.Geoserver.wms('http://191.252.221.146:8080/geoserver/wms', {
    layers: 'hidrogis:bacia_AI_IG6',
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
});
limiteBacia.addTo(map);

statusBacia = true

var barraEscala = L.control.scale({
    position: 'bottomright'
});
barraEscala.addTo(map);

var botaoLimparMapa = document.getElementById('limparMapa');

botaoLimparMapa.addEventListener('click', function() {
    if(statusOttobaciasMontante == true) {
        map.removeLayer(ottobaciasMontante);
        statusOttobaciasMontante = false;
    };

    if(statusOutorgas == true) {
        map.removeLayer(outorgasMontante);
        statusOutorgas = false;
    };

    if (marker) {
        map.removeLayer(marker);
        marcador = null;
    }
});

var geocoder = L.Control.Geocoder.nominatim();

var searchControl = L.Control.geocoder({
    geocoder: geocoder
}).addTo(map);

searchControl.setPosition('topleft');

searchControl.on('markgeocode', function (e) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    marker = L.marker(e.geocode.center, {
        title: e.geocode.name,
        draggable: true
    }).addTo(map);

    marker.bindPopup('Local: ' + e.geocode.name);
});
