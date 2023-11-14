function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
        var cobaciaValue = feature.properties.cobacia_n;
        var cobaciaEdit = cobaciaValue;

        console.log("cobaciaValue: ",cobaciaValue)
        console.log("cobaciaEdit: ",cobaciaEdit)

        while (cobaciaEdit.length > 0 && (parseInt(cobaciaEdit.slice(-1)) % 2 !== 0 || cobaciaEdit.slice(-1) == 0)) {
            cobaciaEdit = cobaciaEdit.slice(0, -1);
        };

        console.log("cobaciaEdit: ",cobaciaEdit)
        
        var ottobaciasMontante = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
            layers: 'hidrogis:ottobacias_AI_IG6_ISR',
            fitLayer: true,
            className: 'camada_ottobacias_montante',
            CQL_FILTER: "cobacia_n LIKE '"+cobaciaEdit+"%' AND cobacia_n >= '"+cobaciaValue+"'"
        });
        ottobaciasMontante.addTo(map);
    });
}

function updateLegend() {
    var legendContent = '<div class="legend-title">Legenda</div>';
    
    // Adicione os itens da legenda para Ottobacias
    legendContent += '<div class="legend-item">Ottobacias: <span style="background-color: rgb(0, 150, 255); opacity: 0.5;"></span></div>';
    
    // Adicione os itens da legenda para Ottotrechos
    legendContent += '<div class="legend-item">Ottotrechos: <span style="border: 1.5px solid rgb(0, 0, 255); opacity: 0.5;"></span></div>';
    
    // Atualize a div da legenda com o conteúdo
    $('#legend').html(legendContent);
}

updateLegend();

var baseOpenStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
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
    maxZoom: 20,
    opacity: 0.5,
    attribution: '<a href="https://www.google.com/maps">Google Streets</a>'
});


var ottotrechos = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottotrechos_AI_IG6',
    className: 'camada_ottotrechos',
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>'
});


var ottobacias = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottobacias_AI_IG6_ISR',
    className: 'camada_ottobacias',
    attribution: '<a href="https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/f7b1fc91-f5bc-4d0d-9f4f-f4e5061e5d8f">ANA</a>',
    onEachFeature: onEachFeature
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

L.control.scale({
    position: 'bottomright'  // Posição no canto inferior direito
}).addTo(map);
