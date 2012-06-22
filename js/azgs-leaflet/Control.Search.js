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
		var that = this;
		this._initLayout();
		
		return this._container;
	},
	
	_setSearchList: function(){
		
	},
	
	_initLayout: function() {
		var className = "acert-control-search";
		var container = this._container = L.DomUtil.create("div", className);	
		
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		var input = this._input = L.DomUtil.create("input", className + "-input", container);
		input.id = this._input.id = "search-input";
		var button = this._button = L.DomUtil.create("button", className + "-button", container);		
		
	},
	
	enableAutocomplete: function() {
		$("#" + this._input.id).autocomplete({source: ["test1", "test2"]})
	}
	
	
})