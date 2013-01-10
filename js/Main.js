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
	var basemapUrl = "/tiles/v2/publicLands/{z}/{x}/{y}.png";
		basemapAttribution = 'Map compilation: <a href="http://www.azgs.az.gov/" target="_blank">AZGS</a>' 
//			+ '&nbsp;Contributors: <a href="http://www.azgs.az.gov/">AZGS</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>',
		basemapOptions = { attribution: basemapAttribution };
	var basemap = new L.TileLayer(basemapUrl, basemapOptions);

	/* WMS layer */
	var wmsUrl = "/geoserver/wms";
		wmsLayer = new L.TileLayer.WMS(wmsUrl, { 
			layers: "vae:usa", 
			format: "image/png", 
			transparent: true 
		}); 
	
	var center = new L.LatLng(34.1618, -110.7);
	
	map.setView(center, 7).addLayer(basemap).addLayer(wmsLayer);
	
	//map.addLayer(wfsLayer);
	
	/** Add search control **/
	searchControl = new L.Control.Search({
		highlightSymbolUrl: "style/images/logos/highlight/?agency?png"
	});
	map.addControl(searchControl);
	searchControl.showPopup();
	
	/// Add facility filter control
	facilitiesFilterControl = new L.Control.Filter([{category : "Agencies", items : agencyItems},
	                                                  {category : "Art & Culture", items : artCultureItems},
	                                                  {category : "Accessibility", items : accessItems}, 
	          	                                      {category : "Information", items : infoItems}, 
	          	                                      {category : "Sites with Camping", items : campingItems}, 
	          	                                      {category : "Facilities", items : facilitiesItems}, 
	          	                                      {category : "Sites with Trails", items : trailsItems}, 
	          	                                      {category : "Natural History", items : naturalHistoryItems}, 
	          	                                      {category : "Water Sports", items : waterSportsItems}],
	          	                                      {toolClear: true});
	map.addControl(facilitiesFilterControl);
	facilitiesFilterControl._control.click()

	/** Add the art and cultural filter
	var artcultureFilterControl = new L.Control.Filter([{category : "Art & Culture", items : artCultureItems}],
			{icon: "url('style/images/tools/arts-culture.png')",
			toolClear: true});
	map.addControl(artcultureFilterControl);**/	
	
	/// Add a single filter control for AOT
	/*var aotControl = new L.Control.Layer({fName: "agency", value: "'AOT'"},{
		icon: "url('style/images/tools/partners.png')",
		activeIcon: "url('style/images/tools/activePartners.png')",
		toolTip: "Designated Arizona Tourist Information"
	});
	map.addControl(aotControl);*/
	
	/// Add map events
	map.on("layeradd", function(e){
		searchControl.setAutocompleteItems([//(artcultureFilterControl.layer || null), 
		                                    (facilitiesFilterControl.layer || null)], 
		                                    "name");
	});
	
	map.on("popupopen", function(e){
		searchControl.hidePopup();
		//artcultureFilterControl.hidePopup();
		facilitiesFilterControl.hidePopup();
		
		this._reopen = false;
		
		/**************************************************************/
		/***Add link redirection for 'View Page'***********************/
		/***this._resetPopup = jQuery.extend({}, e.popup);*************/
		/*var linkInPopup = document.getElementById("view-page");
		
		L.DomEvent.addListener(linkInPopup, 'click', function(evt) {
			var url = ''
				if ($.browser.msie && $.browser.version.substring(0,2) == '8.') {
				url = evt.srcElement.getAttribute("url");
				} else {
				url = evt.target.getAttribute("url");
				}

			
			/***********************************************************
			var goBack = L.DomUtil.create("span", "popup-link-back");
			L.DomEvent.addListener(goBack, 'click', function(evt){
				this._reopen = true;
				this.closePopup();				
			}, this)
			
			
			this._popup._container.appendChild(goBack);
			***********************************************************/
			
		/*	var linkPage = L.DomUtil.create("iframe", "acert-link-frame");
			linkPage.style.width = "900px";
			linkPage.style.height = "520px";
			linkPage.style.marginTop = "15px";
			linkPage.src = url;
			
			this._popup.setContent(linkPage);
		/**************************************************************/	
		}, this);		
	//});	
}

/**********************************************************************/
/***Get google direction for the clicked location**********************/
function goGoogleDirection(strQuery){
	window.open(" http://maps.google.com?q=" + strQuery);
}
