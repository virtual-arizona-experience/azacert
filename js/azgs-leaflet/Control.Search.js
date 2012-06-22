L.Control.Search = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	initialize: function(options){
		L.Util.setOptions(this, options);			
		
		this._isMouseOnMap = true; 
	},
	
	onAdd: function(map) {
		this._initLayout();
		
		return this._container;
	},
	
	_setSearchList: function() {
		
	},
	
	_initLayout: function() {
		var className = "acert-control-search";
		var container = this._container = L.DomUtil.create("div", className);	
		
		/// Resolve conflicts between this control the map activities
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		var input = this._input = L.DomUtil.create("input", className + "-input", container);
		input.id = this._input.id = "search-input";
		
		var button = this._button = L.DomUtil.create("button", className + "-button", container);
		L.DomEvent.addListener(button, 'click', this._search, this);
		
	},
	
	_search: function(evt) {
		if(this._map.highlight) { map.removeLayer(this._map.highlight); }
		
		var searchTerm = $("#search-input").val()
		
		var thisFeature = this._featureKVP[searchTerm];
		
		var coors = thisFeature.geometry.coordinates;
		var latLng = new L.LatLng(coors[1], coors[0]);
		this._map.panTo(latLng);
		
		var highlight = this._map.highlight = new L.Marker(latLng, {
			icon: new L.Icon({ 
				iconUrl: "style/images/yellow-circle.png",
				iconSize: new L.Point(32, 32) 
			}) 
		});
		
		this._map.addLayer(highlight);
	},
	
	setAutocompleteItems: function(jsonLayer, labelField) {
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
	}
		
})