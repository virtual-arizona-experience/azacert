/*
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 */

var map, searchControl, filterControl;
function init(){
	map = new L.Map("map");
	
	// Cloudmade / OpenStreetMap tiled layer
	/*var cmUrl = 'http://{s}.tile.cloudmade.com/f7d28795be6846849741b30c3e4db9a9/997/256/{z}/{x}/{y}.png',
		cmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>',
		cmOptions = { maxZoom: 18, attribution: cmAttribution };
	var cloudmade = new L.TileLayer(cmUrl, cmOptions);*/
	
	// Basemap
	var basemapUrl = "http://opengis.azexperience.org/tiles/v2/ACERT/{z}/{x}/{y}.png";
		basemapAttribution = 'Map data &copy; <a href="http://www.azgs.az.gov/">AZGS</a>' 
			+ '&nbsp;Contributors: <a href="http://www.azgs.az.gov/">AZGS</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' 
			+ '&nbsp;<div style="width: 125px;" class="fb-like" data-send="true" data-layout="button_count" data-width="30" data-show-faces="false" data-font="arial"></div>',
		basemapOptions = { maxZoom: 18, attribution: basemapAttribution };
	var basemap = new L.TileLayer(basemapUrl, basemapOptions);

	/* WMS layer */
	var wmsUrl = "http://opengis.azexperience.org/geoserver/wms";
		wmsLayer = new L.TileLayer.WMS(wmsUrl, {
			maxZoom: 10, 
			layers: "vae:usa", 
			format: "image/png", 
			transparent: true 
		}); 
	
	/* WFS GeoJSON layer */
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
		hoverFld: "name"
	}); 
	
	var center = new L.LatLng(34.1618, -111.53332);
	
	map.setView(center, 7).addLayer(basemap).addLayer(wmsLayer);
	
	map.addLayer(wfsLayer);
	
	searchControl = new L.Control.Search({
		highlightSymbolUrl: "style/images/logos/highlight/?Agency?png"
	});
	map.addControl(searchControl);
	
	filterControl = new L.Control.Filter([{"category" : "Agency", "items" : agencyItems},
	                                      {"category" : "Access", "items" : accessItems}, 
	                                      {"category" : "Information", "items" : infoItems}, 
	                                      {"category" : "Camping", "items" : campingItems}, 
	                                      {"category" : "Facilities", "items" : facilitiesItems}, 
	                                      {"category" : "Trails", "items" : trailsItems}, 
	                                      {"category" : "Natural History", "items" : naturalHistoryItems}, 
	                                      {"category" : "Water Sports", "items" : waterSportsItems},
	                                      {"category" : "Art & Culture", "items" : artCultureItems}]);
	map.addControl(filterControl);
	
	/// Add map events
	map.on("layeradd", function(e){
		searchControl.setAutocompleteItems(this.wfsLayer, "name");
	});
	
	map.on("popupopen", function(e){
		searchControl.hidePopup();
		filterControl.hidePopup();
		
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
