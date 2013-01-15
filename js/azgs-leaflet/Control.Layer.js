/**
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 */


L.Control.Layer = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	_icon: "url('style/images/tools/filter.png')",
	_toolClear: false,
	_tooTip: "Select Categories",
	_layerName: null,
	_layer: null,
	filter: {},
	
	/// 1st step
	initialize: function(filter, options){
		L.Util.setOptions(this, options);
		this._layerName = filter.fName;
		this.filter[this._layerName] = [filter];
		this._setLayer(filter || {});	
		
		if(options){
			this._icon = options.icon || "url('style/images/tools/partners.png')";
			this._tooTip = options.toolTip || "Select Categories";
			this._activeIcon = options.activeIcon || "url('style/images/tools/activePartners.png')";
		}
	},
	
	/// 2nd step
	onAdd: function(map){
		this._initLayout();
		
		return this._container;
	},
	
	/// 3rd step
	_initLayout: function(){
		var className = "acert-control-single-filter";
		var container = this._container = L.DomUtil.create("div", className + " acert-control"); 
		
		/// Resolve conflicts between this control the map activities
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		/// The control tool - top category
		var control = this._control = L.DomUtil.create("a", "acert-control-icon acert-control-show", container);
		control.href = "#";
		control.title = this._tooTip; /// Displayed as tips
		control.toggle = false;
		control.style.backgroundImage = this._icon;
		L.DomEvent.addListener(control, "click", this._onCtrlClick, this);
	},	
	
	_onCtrlClick: function (evt) {
		var thisCtrl = evt.target;
		thisCtrl.toggle = !thisCtrl.toggle;
		
		if(thisCtrl.toggle){
			this._addLayer();
			thisCtrl.style.backgroundImage = this._activeIcon;
		}else{
			this._removeLayer();
			thisCtrl.style.backgroundImage = this._icon;
		}				
	},	
	
	_addLayer: function() {	
		this._map.addLayer(this._layer);
	},
	
	_removeLayer: function() {
		this._map.removeLayer(this._layer);		
	},
	
	_setLayer: function(filter) {
        var that = this;
        
		this._layer = new L.GeoJSON.WFS("/geoserver/wfs", "vae:azacert20130115", {
			pointToLayer: function(latlng) { 
				return new L.Marker(latlng, { 
					icon: new L.Icon({ 
						iconUrl: "style/images/logos/?agency?png", 
						iconHighlightUrl: "style/images/logos/highlight/?agency?png",
						iconSize: new L.Point(16, 16) 
					}) 
				});
			},
			popupObj: new JadeContent("templates/wfsIdentify.jade"),
			popupOptions: { maxWidth: 1000, centered: true },
			hoverFld: "name",
			filter: new PropertyFilter(that.filter) /// PropertyFilter class is defined in "Filter.js"
		});		
	}
	
})