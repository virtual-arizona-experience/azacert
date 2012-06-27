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
		var container = this._container = L.DomUtil.create("div", className);	
		
		/// Resolve conflicts between this control the map activities
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		/// Create control button element
		var controlIcon = this._controlIcon = L.DomUtil.create("a", "acert-control acert-control-show", container); /// Control icon
		controlIcon.href = '#';
		controlIcon.title = 'Search';
		
		L.DomEvent.addListener(controlIcon, 'click', this.showPopup, this);

		/// Create the element containing search functions
		var form = this._form = L.DomUtil.create("div", className + "-items " + "acert-control-form acert-control-hide");
		
		var input = this._input = L.DomUtil.create("input", className + "-input", form);
		input.id = this._input.id = "search-input";
		
		var searchIcon = this._searchIcon = L.DomUtil.create("span", "acert-control-tools ui-icon ui-icon-search", form);
		L.DomEvent.addListener(searchIcon, 'click', this._search, this);
		
		var collapseIcon = this._collapseIcon = L.DomUtil.create("span", "acert-control-tools ui-icon ui-icon-carat-1-e", form);
		L.DomEvent.addListener(collapseIcon, 'click', this.hidePopup, this);
		
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
		
		var thisFeature = this._featureKVP[searchTerm];
		
		var coors = thisFeature.geometry.coordinates;
		var latLng = new L.LatLng(coors[1], coors[0]);
		this._map.panTo(latLng);
		
		var highlight = this._map.highlight = new L.Marker(latLng, {
			icon: new L.Icon({ 
				iconUrl: this.options.highlightSymbolUrl || "style/images/red-circle.png",
				iconSize: new L.Point(16, 16) 
			}) 
		});
		
		this._map.addLayer(highlight);
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
	
	/// Expand the search dialog
	_show: function (dom) {
		if(dom.classList.contains("acert-control-hide")){
			dom.classList.remove("acert-control-hide")
		}
		
		dom.classList.add("acert-control-show");
	},
	
	/// Collapse the search dialog
	_hide: function (dom) {
		if(dom.classList.contains("acert-control-show")){
			dom.classList.remove("acert-control-show")
		}
		
		dom.classList.add("acert-control-hide");
	}
		
})