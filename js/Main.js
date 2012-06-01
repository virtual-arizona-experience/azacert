var map;
function init(){
	map = new L.Map("map");
	
	/* ESRI tiled service */
	var imgLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	var boundLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
	
	/* WFS GeoJSON layer */
	var wfsLayer = map.wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:ACERT", {
		pointToLayer: function(latlng) { 
			return new L.Marker(latlng, { 
				icon: new L.Icon({ 
					iconUrl: "style/images/yellow-circle.png", 
					iconSize: new L.Point(40, 40) 
				}) 
			});
		},
		popupObj: new JadeContent("templates/example.jade"),
		popupOptions: { maxWidth: 1000, centered: true },
		hoverFld: "Name",
		filter: new PropertyFilter({"Agency": "'NPS'"})
	}); 
	
	var center = new L.LatLng(34.1618, -111.53332);
	
	map.setView(center, 7).addLayer(imgLayer);

	setTimeout(function(){
		map.addLayer(boundLayer);},
		100);
	
	map.addLayer(wfsLayer);
	
	var filterControl = new L.Control.Filter([agencyFilterItems, facilityFilterItems]);
	map.addControl(filterControl);

}