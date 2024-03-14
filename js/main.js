

var map = L.map('map').setView([-14.235, -51.925], 4);


const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
const googleSat = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

//Iníco Camada cartoDBvar 
const cartoDB  = L.tileLayer(  "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",  { 
     maxZoom: 20,    
     attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>", 
});
  // Fim Camada cartoDB
  const painel = L.tileLayer.wms('https://panorama.sipam.gov.br/geoserver/painel_do_fogo/ows?', {
    layers: 'painel_do_fogo:mv_evento_filtro',
    format: 'image/png',
  transparent: true,

}).addTo(map);
const focos_calor = L.tileLayer.wms('https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/c844205829e4cdbf1c4c47eee6bfd0ff', {
    layers: 'fires_viirs_snpp_24',
    format: 'image/png',
    transparent: true,
})

const ibge_muni = L.tileLayer.wms('https://panorama.sipam.gov.br/geoserver/painel_do_fogo/ows?', {
    layers: 'painel_do_fogo:ibge_bc250_lim_municipio_a',
    format: 'image/png',
    transparent: true,
    
})
const ibge_estadual = L.tileLayer.wms('https://geoservicos.ibge.gov.br/geoserver/ows?', {
    layers: 'CGEO:C02_limite_estadual_2010',
    format: 'image/png',
    transparent: true,
   

})



// const Url_newNasa = `https://map1b.vis.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?`
// // Início Camadas Nasa
// var TerraModis = L.tileLayer.wms(Url_newNasa, {layers: "MODIS_Terra_CorrectedReflectance_TrueColor", format: "image/png", transparent: true });
// // var AquaModis = L.tileLayer.wms(Url_newNasa, { layers: "MODIS_Aqua_CorrectedReflectance_TrueColor",  format: "image/png",   transparent: true});
// // var ViirsNoaa = L.tileLayer.wms(Url_newNasa, { layers: "VIIRS_NOAA20_CorrectedReflectance_TrueColor",  format: "image/png",   transparent: true});
// // var ViirsSnpp = L.tileLayer.wms(Url_newNasa, {  layers: "VIIRS_SNPP_CorrectedReflectance_TrueColor",  format: "image/png", transparent: true});
// // var nighttime = L.tileLayer.wms(Url_newNasa, {  layers: "VIIRS_SNPP_DayNightBand_ENCC",  format: "image/png", transparent: true,});
// // var TerraModisBands = L.tileLayer.wms(Url_newNasa, {  layers: "MODIS_Terra_CorrectedReflectance_Bands721",  format: "image/png", transparent: true});
// // var AquaModisBands = L.tileLayer.wms(Url_newNasa, {  layers: "MODIS_Aqua_CorrectedReflectance_Bands721",  format: "image/png", transparent: true});
// // var ViirsNoaaBands = L.tileLayer.wms(Url_newNasa, {  layers: "VIIRS_NOAA20_CorrectedReflectance_BandsM11-I2-I1",  format: "image/png",transparent: true});
// // var ViirsSnppBands = L.tileLayer.wms(Url_newNasa, {  layers: "VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1",  format: "image/png",transparent: true});



// Criando um controle personalizado com a logo
var logoControl = L.control({position: 'bottomleft'});

logoControl.onAdd = function(map) {
    var logoDiv = L.DomUtil.create('div', 'leaflet-control-logo');
    logoDiv.innerHTML = '<img src="./assets/logoHapia.png" alt="Logo" width="100" height="100">';
    return logoDiv;
};

// Adicionando o controle ao mapa
logoControl.addTo(map);



var baseMaps = {
    "OpenStreetMap": osm,
    "Google Satélite": googleSat,
    "Mapa Noturno": cartoDB
    
};
  var overlayMaps = {
    "Focos de Calor - MODIS": focos_calor,
    "Focos de Calor - NOAA20/VIIRS ": painel,
    "Limite dos Municípios - IBGE" : ibge_muni,
    "Limite Estadual - IBGE": ibge_estadual
  };

  L.control.layers(baseMaps,overlayMaps).addTo(map);


// Criando os pontos e adicionando-os ao mapa
var features = turf.featureCollection([
    turf.point([-34.9724, -8.3952], {"name": "Abreu e Lima - Ipojuca-PE" }),
    turf.point([-43.2699, -22.7199], {"name": "Duque de Caxias" }),
    turf.point([-44.0962, -19.9756], {"name": "Gabriel Passos - Betim-BH" }),
    turf.point([-49.3607, -25.5679], {"name": "Presidente Getúlio Vargas - Araucária-PR" }),
    turf.point([-38.5718, -12.7076], {"name": "Landulpho Alves - São Francisco do Conde-BH" }),
    turf.point([-59.9538, -3.1464],  {"name": "Isaac Sabbá - Manaus-AM" }),
    turf.point([-51.1627, -29.8716 ], {"name": "Alberto Pasqualini - Esteio-RS"}),
    turf.point([-45.8242, -23.1930 ], {"name": "Henrique Lage - São José dos Campos-SP"}),
    turf.point([-46.4802, -23.6394 ], {"name": "Capuava - Mauá-SP"}),
    turf.point([-46.4329, -23.8722 ], {"name": "Presidente Bernardes - Cubatão-SP"}),
    turf.point([-47.1315, -22.7282 ], {"name": "Planalto de Paulínia - Paulínia-SP"}),
  ]);
  // Função para gerar uma cor com base no tamanho do buffer
function getColor(size) {
  // Defina os limites de tamanho do buffer e as cores correspondentes
  var colors = ['#FF0000','#FFA500','#CD853F','#FFFF00']; // Vemelho, Laranja, Amarelo, 
  var thresholds = [1.5, 4, 8, 15]; // Limites de tamanho do buffer em quilômetros
  
  // Itere sobre os limites e encontre a cor correspondente
  for (var i = 0; i < thresholds.length; i++) {
      if (size <= thresholds[i]) {
          return colors[i];
      }
  }
  
  // Se o tamanho for maior que todos os limites, retorne a última cor
  return colors[colors.length - 1];
}
  // Definindo os tamanhos dos buffers
  var bufferSizes = [1.5, 4, 8, 15]; // Em quilômetros


  // Adiciona os buffers das refinarias ao mapa
  bufferSizes.forEach(function(size) {
    var buffer = turf.buffer(features, size, { units: 'kilometers' });
    var color = getColor(size); // Obtém a cor com base no tamanho do buffer
    var bufferLayer = L.geoJSON(buffer, {
      style: {
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.2
      }
    }).addTo(map);
    overlayMaps[`Refinaria Buffer (${size} km)`] = bufferLayer;
  });

  // Função para centrar o mapa na localização da refinaria
function centerMapOnRefinery(refineryName) {
    var refinery = features.features.find(function(feature) {
      return feature.properties.name === refineryName;
    });
  
    if (refinery) {
      map.flyTo([refinery.geometry.coordinates[1], refinery.geometry.coordinates[0]], 10);
      
    }
  }
  
  // Adicionando manipuladores de eventos aos links da lista
  document.querySelectorAll('.list-group-item').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var refineryName = link.textContent.trim();
      centerMapOnRefinery(refineryName);
    });
  });
  
