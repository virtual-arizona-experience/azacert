/**
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 */

L.Control.Search = L.Control.extend({
	options: {
		position: "topright"
	},
	
	/// 1st step; runs when this control is constructed
	initialize: function(options){
		L.Util.setOptions(this, options);			
		
		this._isMouseOnMap = true; 
	},
	
	/// 2nd step; runs when this control is added onto map
	onAdd: function(map) {
		this._initLayout();
		
		return this._container;
	},
	
	_initLayout: function() {
		var className = "acert-control-search";
		var container = this._container = L.DomUtil.create("div", className + " acert-control");	
		
		/// Resolve conflicts between this control the map activities
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		/// Create control button element
		var controlIcon = this._controlIcon = L.DomUtil.create("a", "acert-control-icon acert-control-show", container); /// Control icon
		controlIcon.href = '#';
		controlIcon.title = 'Site Search';
		
		L.DomEvent.addListener(controlIcon, 'click', this.showPopup, this);

		/// Create the element containing search functions
		var form = this._form = L.DomUtil.create("div", className + "-items " + "acert-control-form acert-control-hide");
		
		var input = this._input = L.DomUtil.create("input", className + "-input", form);
		input.id = this._input.id = "search-input";
		input.title = "Input Search Keyword";
		input.placeholder = " < Search for Site >";
		L.DomEvent.addListener(input, 'keypress', function(evt){
			if(evt.keyCode == 13) {
				this._search();
			}
		}, this);
		
		/// Add close button
		var close = L.DomUtil.create("span", "acert-control-close", form);
		close.title = "Close";
		L.DomEvent.addListener(close, "click", this.hidePopup, this);
		
		/// Add button to clear the highlight feature
		var clear = L.DomUtil.create("span", "acert-control-reset", form);
		L.DomEvent.addListener(clear, "click", this._clearHighlight, this);
		clear.title = "Reset";
		
		/// Add search button
		var searchIcon = this._searchIcon = L.DomUtil.create("span", "acert-control-search-icon", form);
		searchIcon.title = "Search";
		L.DomEvent.addListener(searchIcon, 'click', this._search, this);
		
		container.appendChild(form);
		
	},
	
	showPopup: function() {
		this._show(this._form);
		this._hide(this._controlIcon);
	},
	
	hidePopup: function() {
		this._clearHighlight();
		this._input.value = "";
		this._show(this._controlIcon);
		this._hide(this._form);
	},
	
	_search: function(searchTerm) {
		if(this._map.highlight) { map.removeLayer(this._map.highlight); }
		
		var searchTerm = searchTerm || $("#search-input").val();
		
		/// Find the feature pair
		var thisFeature = this._featureKVP[searchTerm];
		
		if (!thisFeature) { return ; }
		
		var coors = thisFeature.geometry.coordinates;
		var latLng = new L.LatLng(coors[1], coors[0]);
		this._map.panTo(latLng);
		
		var filter = "featureid=" + thisFeature.id;
		
		this._highlightFeature(filter);
		
	},
	
	/// Highlight the search result
	_highlightFeature: function(filter) {
		if(this._map.highlightLayer){
			this._map.removeLayer(this._map.highlightLayer);
		}
		
		var highlightLayer = this._map.highlightLayer = new L.GeoJSON.WFS("/geoserver/wfs", "vae:azacert", {
			pointToLayer: function(latlng) { 
				return new L.Marker(latlng, { 
					icon: new L.Icon({ 
						iconUrl: "style/images/logos/highlight/?agency?png",
						//iconHighlightUrl: "style/images/logos/highlight/?agency?png",
						iconSize: new L.Point(64, 64) 
					}) 
				});
			},
			popupObj: new JadeContent("templates/wfsIdentify.jade"),
			popupOptions: { maxWidth: 1000, centered: true },
			hoverFld: "name",
			filter: filter /// PropertyFilter class is defined in "Filter.js"
		});
		
		this._map.addLayer(highlightLayer);
	},
	
	_clearHighlight: function() {
		this._input.value = "";
		if(this._map.highlightLayer) { map.removeLayer(this._map.highlightLayer); }
	},
	
	/**
	 * Summary:
	 * 		Set up the autocomplete items for the search box
	 * Parameters:
	 * 		jsonLayers - the layers applied by the search functions, array type
	 * 		labelField - which property field used for search
	 */
	setAutocompleteItems: function(jsonLayers, labelField) {
		if (!jsonLayers) { return; }
		this.autocompleteItems = [];
		this._featureKVP = {};
		
		for (var i = 0; i < jsonLayers.length; i ++){
			var jsonLayer = jsonLayers[i];
			
			if(!(jsonLayer ? jsonLayer.jsonData : false)) { continue; }
					
			var features = jsonLayer.jsonData.features;
			
			for(var i = 0; i < features.length; i ++) {
				var thisFeature = features[i];
				var thisKey = thisFeature.properties[labelField];
				this._featureKVP[thisKey] = thisFeature;
				
				this.autocompleteItems.push(thisKey);
			}			
		}

		this.autocompleteItems.sort();
		
		var that = this;
		$("#" + this._input.id).autocomplete({
			source: that.autocompleteItems,
			select: function(evt, ui) { that._search(ui.item.label); }
		});
	},
	
	/// Expand the popup
	_show: function (dom) {
		if(dom.className.indexOf("acert-control-hide") != -1) {
			dom.className = dom.className.replace("acert-control-hide", "acert-control-show");
		} else if (dom.className.indexOf("acert-control-show") == -1) {
			if(dom.className.charAt(dom.className.length -1) != " ") {
				dom.className += " ";
			}
			
			dom.className += "acert-control-show";			
		}		
	},
	
	/// Close the popup
	_hide: function (dom) {
		if(dom.className.indexOf("acert-control-show") != -1){
			dom.className = dom.className.replace("acert-control-show", "acert-control-hide");
		} else if (dom.className.indexOf("acert-control-hide") == -1) {
			if(dom.className.charAt(dom.className.length -1) != " ") {
				dom.className += " ";
			}
			
			dom.className += "acert-control-hide";		
		}
	
	}
		
})