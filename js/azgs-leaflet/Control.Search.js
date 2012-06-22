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
		
		// Resolve conflicts between this control the map activities
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		var input = this._input = L.DomUtil.create("input", className + "-input", container);
		input.id = this._input.id = "search-input";
		var button = this._button = L.DomUtil.create("button", className + "-button", container);		
		
	},
	
	setAutocompleteItems: function(jsonLayer, labelField) {
		var that = this;
		this.autocompleteItems = [];
		var features = this._features = jsonLayer.jsonData.features;		
		
		for(var i = 0; i < features.length; i ++) {
			var thisFeature = features[i];
			var obj = {};
			obj["label"] = thisFeature.properties[labelField];
			obj["value"] = i;
			
			this.autocompleteItems.push(thisFeature.properties[labelField]);
		}
		
		this.autocompleteItems.sort();
		
		$("#" + this._input.id).autocomplete({source: that.autocompleteItems});
	}
	
	
})