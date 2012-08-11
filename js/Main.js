/**
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 */

var map, searchControl, facilitiesFilterControl;
function init(){
	map = new L.Map("map", {
		minZoom: 7,
		maxZoom: 12,
		maxBounds: new L.LatLngBounds(new L.LatLng(29, -118), new L.LatLng(39, -104)) 
	});
	
	// Cloudmade / OpenStreetMap tiled layer
	/*var cmUrl = 'http://{s}.tile.cloudmade.com/f7d28795be6846849741b30c3e4db9a9/997/256/{z}/{x}/{y}.png',
		cmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>',
		cmOptions = { maxZoom: 18, attribution: cmAttribution };
	var cloudmade = new L.TileLayer(cmUrl, cmOptions);*/
	
	// Basemap
	var basemapUrl = "http://opengis.azexperience.org/tiles/v2/publicLands/{z}/{x}/{y}.png";
		basemapAttribution = 'Map data &copy; <a href="http://www.azgs.az.gov/">AZGS</a>' 
			+ '&nbsp;Contributors: <a href="http://www.azgs.az.gov/">AZGS</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		basemapOptions = { attribution: basemapAttribution };
	var basemap = new L.TileLayer(basemapUrl, basemapOptions);

	/* WMS layer */
	var wmsUrl = "http://opengis.azexperience.org/geoserver/wms";
		wmsLayer = new L.TileLayer.WMS(wmsUrl, { 
			layers: "vae:usa", 
			format: "image/png", 
			transparent: true 
		}); 
	
	/***********************************************************************************************************************
	 * Configure the initial WFS GeoJSON layer
	 * Settings:
	 * 		initFilter - set up the features needs to be displayed initially 
	 */
	var initFilter = {cql: escape(
				"agency<>'AOT'" /// Can be changed
			)}	;
	
	var wfsLayer = map.wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azacert", {
		pointToLayer: function(latlng) { 
			return new L.Marker(latlng, { 
				icon: new L.Icon({ 
					iconUrl: "style/images/logos/?agency?png", /// ? + property name used as the image name + ? + image type
					iconHighlightUrl: "style/images/logos/highlight/?agency?png",
					iconSize: new L.Point(16, 16) 
				}) 
			});
		},
		popupObj: new JadeContent("templates/wfsIdentify.jade"),
		popupOptions: { maxWidth: 1000, centered: true },
		hoverFld: "name",
		filter: initFilter
	}); 
	/***********************************************************************************************************************/
	
	var center = new L.LatLng(34.1618, -111.53332);
	
	map.setView(center, 7).addLayer(basemap).addLayer(wmsLayer);
	
	map.addLayer(wfsLayer);
	
	/// Add search control
	searchControl = new L.Control.Search({
		highlightSymbolUrl: "style/images/logos/highlight/?agency?png"
	});
	map.addControl(searchControl);
	
	/// Add a single filter control for AOT
	var aotControl = new L.Control.Layer({fName: "agency", value: "'AOT'"},{
		icon: "url('style/images/tools/partners.png')",
		activeIcon: "url('style/images/tools/activePartners.png')",
		toolTip: "Designated Arizona Tourist Information"
	});
	map.addControl(aotControl);
	
	/// Add the art and cultural filter
	var artcultureFilterControl = new L.Control.Filter([{category : "Art & Culture", items : artCultureItems}],
			{icon: "url('style/images/tools/arts-culture.png')"});
	map.addControl(artcultureFilterControl);
	
	/// Add facility filter control
	facilitiesFilterControl = new L.Control.Filter([{category : "Agency", items : agencyItems},
	                                                  {category : "Access", items : accessItems}, 
	          	                                      {category : "Information", items : infoItems}, 
	          	                                      {category : "Camping", items : campingItems}, 
	          	                                      {category : "Facilities", items : facilitiesItems}, 
	          	                                      {category : "Trails", items : trailsItems}, 
	          	                                      {category : "Natural History", items : naturalHistoryItems}, 
	          	                                      {category : "Water Sports", items : waterSportsItems}],
	          	                                      {toolClear: true});
	map.addControl(facilitiesFilterControl);
	
	/// Build connection between two filters
	
	
	/// Add map events
	map.on("layeradd", function(e){
		searchControl.setAutocompleteItems(this.wfsLayer, "name");
	});
	
	map.on("popupopen", function(e){
		searchControl.hidePopup();
		artcultureFilterControl.hidePopup();
		facilitiesFilterControl.hidePopup();
		
		this._reopen = false;
		
		/**************************************************************/
		/***Add link redirection for 'View Page'***********************/
		/***this._resetPopup = jQuery.extend({}, e.popup);*************/
		var linkInPopup = document.getElementById("view-page");
		
		L.DomEvent.addListener(linkInPopup, 'click', function(evt) {
			var url = evt.target.getAttribute("url");
			
			/***********************************************************
			var goBack = L.DomUtil.create("span", "popup-link-back");
			L.DomEvent.addListener(goBack, 'click', function(evt){
				this._reopen = true;
				this.closePopup();				
			}, this)
			
			
			this._popup._container.appendChild(goBack);
			***********************************************************/
			
			var linkPage = L.DomUtil.create("iframe", "acert-link-frame");
			linkPage.style.width = "800px";
			linkPage.style.height = "520px";
			linkPage.style.marginTop = "15px";
			linkPage.src = url;
			
			this._popup.setContent(linkPage);
		/**************************************************************/	
		}, this);		
	});	
}

/**********************************************************************/
/***Get google direction for the clicked location**********************/
function goGoogleDirection(strQuery){
	window.open(" http://maps.google.com?q=" + strQuery);
}
