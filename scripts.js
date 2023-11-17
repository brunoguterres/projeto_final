var ottobaciasMontante;
var outorgasMontante;

var statusOttobacias = false
var statusOutorgas = false

function selecaoMontante(feature, layer) {
    layer.on('click', function (e) {

        var cobaciaValue = feature.properties.cobacia_n;
        var cobaciaEdit = cobaciaValue;

        if(statusOttobacias == true) {
            map.removeLayer(ottobaciasMontante);
        };

        if(statusOutorgas == true) {
            map.removeLayer(outorgasMontante);
        };

        while (cobaciaEdit.length > 0 && (parseInt(cobaciaEdit.slice(-1)) % 2 !== 0 || cobaciaEdit.slice(-1) == 0)) {
            cobaciaEdit = cobaciaEdit.slice(0, -1);
        };
        
        ottobaciasMontante = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
            layers: 'hidrogis:ottobacias_AI_IG6_ISR',
            style: {
                color: "rgba(200, 100, 0)",
                fillColor: "rgba(255, 150, 0)",
                weight: "1",
            },
            fitLayer: true,
            attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
            CQL_FILTER: "cobacia_n LIKE '"+cobaciaEdit+"%' AND cobacia_n >= '"+cobaciaValue+"'",
        });
        ottobaciasMontante.addTo(map);
        statusOttobacias = true

        outorgasMontante = L.Geoserver.wms('http://191.252.221.146:8080/geoserver/wms', {
            layers: 'hidrogis:outorgas_AI_IG6_CNARH',
            attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
            CQL_FILTER: "cobacia_n LIKE '"+cobaciaEdit+"%' AND cobacia_n >= '"+cobaciaValue+"'",
        });
        outorgasMontante.addTo(map);
        statusOutorgas = true

        console.log('statusOttobacias: ', statusOttobacias)
        console.log('statusOutorgas: ', statusOutorgas)
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

var ottotrechos = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottotrechos_AI_IG6',
    style: {
        color: "rgba(120, 120, 255, 1)",
        weight: "1.5",
    },
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
});

var ottobacias = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottobacias_AI_IG6_ISR',
    style: {
        color: "rgba(255, 255, 255, 1)",
        fillColor: "rgba(0, 150, 255, 0.5)",
        weight: "1",
    },
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
    onEachFeature: selecaoMontante,
});

var map = L.map('map', {
    center: [-15, -51.5],
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

var barraEscala = L.control.scale({
    position: 'bottomright'  // Posição no canto inferior direito
});
barraEscala.addTo(map);

var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Legenda</h4>';
    div.innerHTML += '<i class="legend-icon camada_ottobacias"></i> Ottobacias<br>';
    div.innerHTML += '<i class="legend-icon camada_ottotrechos"></i> Ottotrechos<br>';
    return div;
};

legend.addTo(map);

var botaoLimparMapa = document.getElementById('limparMapa');

botaoLimparMapa.addEventListener('click', function() {
    if(statusOttobacias == true) {
        map.removeLayer(ottobaciasMontante);
    };
    statusOttobacias = false;

    if(statusOutorgas == true) {
        map.removeLayer(outorgasMontante);
    };
    statusOutorgas = false;

    console.log('statusOttobacias: ', statusOttobacias)
    console.log('statusOutorgas: ', statusOutorgas)
});