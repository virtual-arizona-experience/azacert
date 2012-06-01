var filterItems = {
		"FeeArea": "Fee Area",
		"SeasonalUs": "Seasonal Use",
		"DisabledAc": "Disabled Access",
		"Interpreti": "Interpretive Exhibits",
		"VisitorInf": "Visitor Infomation",
		"Restrooms": "Restrooms",
		"DrinkingWa": "Drinking Water",
		"Showers": "Showers",
		"DumpStatio": "Dump Station",
		"ElectricHo": "Electric Hookups",
		"DevelopedC": "Developed Campsites",
		"PrimitiveC": "Primitive Camping",
		"GroupCamp_": "Group Camp/Picnic",
		"PicnicArea": "Picnic Area",
		"Backcountr": "Backcountry Use Permit",
		"HikingTrai": "Hiking Trails",
		"BicycleTra": "Bicycle Trails",
		"OHVTrails": "OHV Trails",
		"Equestrian": "Equestrian Trails",
		"SelfGuided": "Self-Guided Tours",
		"Historical": "Historical/Archaeological",
		"Geological": "Geological/Natural Area",
		"Wildlife_B": "Wildlife/Birding Viewing",
		"ScenicView": "Scenic View",
		"Swimming_H": "Swimming/Hot Springs",
		"Canoe_Raft": "Canoe/Rafting",
		"Fishing": "Fishing",
		"BoatingFac": "Boating Facilities",
		"Boating": "Boating",
		"WaterSport": "Water Sport",
		"WinterSpor": "Winter Sport"		
};

var map;
function init(){
	map = new L.Map("map");
	
	/* ESRI tiled service */
	var imgLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	var boundLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
	
	/* WFS GeoJSON layer */
	var wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:ACERT", {
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
		filter: new PropertyFilter({"FeeArea": "1", "Fishing": "1"})
	}); 
	
	var center = new L.LatLng(34.1618, -111.53332);
	
	map.setView(center, 7).addLayer(imgLayer);

	setTimeout(function(){
		map.addLayer(boundLayer);},
		100);
	
	map.addLayer(wfsLayer);
	
	var filterControl = new L.Control.Filter(filterItems);
	map.addControl(filterControl);

}