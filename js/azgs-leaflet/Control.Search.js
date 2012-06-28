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
		
		var searchIcon = this._searchIcon = L.DomUtil.create("span", "acert-control-search-icon", form);
		L.DomEvent.addListener(searchIcon, 'click', this._search, this);
		
		/// Add close button
		var close = L.DomUtil.create("span", "acert-control-close", form);
		L.DomEvent.addListener(close, "click", this.hidePopup, this);
		
		container.appendChild(form);
		
	},
	
	showPopup: function() {
		this._show(this._form);
		this._hide(this._controlIcon);
	},
	
	hidePopup: function() {
		this._show(this._controlIcon);
		this._hide(this._form);
	},
	
	_search: function() {
		if(this._map.highlight) { map.removeLayer(this._map.highlight); }
		
		var searchTerm = $("#search-input").val()
		
		/// Find the feature pair
		var thisFeature = this._featureKVP[searchTerm];
		
		var coors = thisFeature.geometry.coordinates;
		var latLng = new L.LatLng(coors[1], coors[0]);
		this._map.panTo(latLng);
		
		var highlightSymbolUrl = this._parseIconUrl(this.options.highlightSymbolUrl, thisFeature);
		
		var highlight = this._map.highlight = new L.Marker(latLng, {
			icon: new L.Icon({ 
				iconUrl: highlightSymbolUrl || "style/images/red-circle.png",
				iconSize: new L.Point(32, 32) 
			}) 
		});
		
		this._map.addLayer(highlight);
	},
	
	_parseIconUrl: function(origUrl, feature) {
		
		var iconUrl = this.options.highlightSymbolUrl;
		if(iconUrl.split("?").length == 3) { ///If the the iconUrl contains two parameters (with '?')
			var iconBaseUrl = iconUrl.split("?")[0];
			var imgName = feature.properties[iconUrl.split("?")[1]].replace(/\s/g, "") + "." + iconUrl.split("?")[2];
			iconUrl = iconBaseUrl + imgName;	
		}	
		
		return iconUrl;
	},
	
	_clearHighlight: function() {
		if(this._map.highlight) { map.removeLayer(this._map.highlight); }
	},
	
	setAutocompleteItems: function(jsonLayer, labelField) {
		if(!jsonLayer.jsonData) { return ; }
		
		var that = this;
		this.autocompleteItems = [];
		this._featureKVP = {};
		
		var features = jsonLayer.jsonData.features;
		
		for(var i = 0; i < features.length; i ++) {
			var thisFeature = features[i];
			var thisKey = thisFeature.properties[labelField];
			this._featureKVP[thisKey] = thisFeature;
			
			this.autocompleteItems.push(thisKey);
		}
		
		this.autocompleteItems.sort();
		
		$("#" + this._input.id).autocomplete({
			source: that.autocompleteItems
		});
	},
	
	/// Expand the popup
	_show: function (dom) {
		if(dom.className.indexOf("acert-control-hide") != -1) {
			dom.className = dom.className.replace("acert-control-hide", "");
		}
		
		if(dom.className.charAt(dom.className.length -1) != " ") {
			dom.className += " ";
		}
		
		dom.className += "acert-control-show";
	},
	
	/// Collapse the popup
	_hide: function (dom) {
		if(dom.className.indexOf("acert-control-show") != -1){
			dom.className = dom.className.replace("acert-control-show", "");
		}
	
		if(dom.className.charAt(dom.className.length -1) != " ") {
			dom.className += " ";
		}
		
		dom.className += "acert-control-hide";
	}
		
})