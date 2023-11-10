function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
        var cobaciaValue = feature.properties.cobacia;
        var cobaciaEdit = cobaciaValue;

        while (cobaciaEdit.length > 0 && parseInt(cobaciaEdit.slice(-1)) % 2 !== 0) {
            cobaciaEdit = cobaciaEdit.slice(0, -1);
        };
        
        var ottobaciasMontante = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
            layers: 'hidrogis:ottobacias_AI_IG6_ISR',
            fitLayer: false,
            className: 'camada_ottobacias_montante',
            CQL_FILTER: "cobacia LIKE '"+cobaciaEdit+"%' AND cobacia >= '"+cobaciaValue+"'"
        });
        ottobaciasMontante.addTo(map);
    });
}

var baseOpenStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    opacity: 0.5,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var baseGoogleSatelite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    opacity: 0.5,
    attribution: 'Imagem de satélite © <a href="https://www.google.com/maps">Google Maps</a>'
});

var baseGoogleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    opacity: 0.5,
    attribution: 'Google Streets © <a href="https://www.google.com/maps">Google Maps</a>'
});


var ottotrechos = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottotrechos_AI_IG6',
    className: 'camada_ottotrechos',
    attribution: 'ANA'
});


var ottobacias = L.Geoserver.wfs('http://191.252.221.146:8080/geoserver/wfs', {
    layers: 'hidrogis:ottobacias_AI_IG6_ISR',
    className: 'camada_ottobacias',
    attribution: 'ANA',
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