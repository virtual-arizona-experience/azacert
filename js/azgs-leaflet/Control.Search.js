L.Control.Search = L.Control.extend({
	options: {
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
		var controlIcon = this._controlIcon = L.DomUtil.create("a", "acert-control", container); /// Control icon
		controlIcon.href = '#';
		controlIcon.title = 'Search';
			
		this.show(controlIcon);
		
		L.DomEvent.addListener(controlIcon, 'click', this._showPopup, this);

		/// Create the element containing search functions
		var form = this._form = L.DomUtil.create("div", className + '-items');
		
		var input = this._input = L.DomUtil.create("input", className + "-input", form);
		input.id = this._input.id = "search-input";
		
		var searchIcon = this._searchIcon = L.DomUtil.create("button", className + "-button", form);
		L.DomEvent.addListener(searchIcon, 'click', this._search, this);
		
		var collapseIcon = this._collapseIcon = L.DomUtil.create("button", className + "-collapse", form);
		L.DomEvent.addListener(collapseIcon, 'click', this._hidePopup, this);
		
		this.hide(form);
		container.appendChild(form);
		
	},
	
	_showPopup: function() {
		this.show(this._form);
		this.hide(this._controlIcon);
	},
	
	_hidePopup: function() {
		this.show(this._controlIcon);
		this.hide(this._form);
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
	},

	show: function (dom) {
		if(dom.classList.contains("acert-control-hide")){
			dom.classList.remove("acert-control-hide")
		}
		
		dom.classList.add("acert-control-show");
	},

	hide: function (dom) {
		if(dom.classList.contains("acert-control-show")){
			dom.classList.remove("acert-control-show")
		}
		
		dom.classList.add("acert-control-hide");
	}
		
})