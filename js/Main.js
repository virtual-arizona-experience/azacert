var map, searchControl;
function init(){
	map = new L.Map("map");
	
	// Cloudmade / OpenStreetMap tiled layer
	var cmUrl = 'http://{s}.tile.cloudmade.com/f7d28795be6846849741b30c3e4db9a9/997/256/{z}/{x}/{y}.png',
		cmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>',
		cmOptions = { maxZoom: 18, attribution: cmAttribution };
	var cloudmade = new L.TileLayer(cmUrl, cmOptions);

	/* WMS layer */
	var wmsUrl = "http://opengis.azexperience.org/geoserver/wms";
		wmsLayer = new L.TileLayer.WMS(wmsUrl, {
			maxZoom: 10, 
			layers: "vae:usa", 
			format: "image/png", 
			transparent: true 
		}); 
	
	/* WFS GeoJSON layer */
	var wfsLayer = map.wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:ACERT", {
		pointToLayer: function(latlng) { 
			return new L.Marker(latlng, { 
				icon: new L.Icon({ 
					iconUrl: "style/images/logos/?Agency?png", /// ? + property name used as the image name + ? + image type
					iconSize: new L.Point(16, 16) 
				}) 
			});
		},
		popupObj: new JadeContent("templates/wfsIdentify.jade"),
		popupOptions: { maxWidth: 1000, centered: true },
		hoverFld: "Name"
	}); 
	
	var center = new L.LatLng(34.1618, -111.53332);
	
	map.setView(center, 7).addLayer(cloudmade).addLayer(wmsLayer);
	
	map.addLayer(wfsLayer);
	
	searchControl = new L.Control.Search({
		highlightSymbolUrl: "style/images/red-circle.png"
	});
	map.addControl(searchControl);
	
	var filterControl = new L.Control.Filter([accessItems, infoItems]);
	map.addControl(filterControl);
	
	map.on("layeradd", function(e){
		searchControl.setAutocompleteItems(this.wfsLayer, "Name");
	});
	

}