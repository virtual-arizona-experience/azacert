/*
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 */

L.Control.Filter = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	_icon: "url('style/images/tools/filter.png')",
	_toolClear: false,
	_tooTip: "Select Categories",
	
	/// 1st step
	initialize: function(rFilters, options){
		L.Util.setOptions(this, options);
		
		if(options){
			this._icon = options.icon || "url('style/images/tools/filter.png')";
			this._toolClear = options.toolClear || false;
			this._tooTip = options.toolTip || "Select Categories";			
		}
		
		this._listItems = []; /// Item objects in the popup
		this._categories = []; /// Section IDs in the popup
		
		var isBinaryField, formId;
		
		for(var i = 0; i < rFilters.length; i ++){
			this._categories.push(rFilters[i].category);
			var rFilterItems = rFilters[i].items;
			
			for(var j = 0; j < rFilterItems.length; j ++){				
				
				/// Identify if it works on multiple fields with binary values 
				/// or on a single field with multiple values
				if(rFilterItems[j].vPairs.length == 1) {
					isBinaryField = true;
				}else{
					isBinaryField = false;
				}
				
				/// Save the list item objects
				for(var k = 0; k < rFilterItems[j].vPairs.length; k ++){
					this._addFilterObj(isBinaryField, 
							rFilters[i].category,
							rFilterItems[j].fName, 
							rFilterItems[j].vPairs[k].label, 
							rFilterItems[j].vPairs[k].value);
				}					
			}
			
		}
	},
	
	setRelatedControl: function(control){
		this._extraForm = control._form;
	},
	
	/// name: field name in attribute table
	/// label: the text shown in the popup
	_addFilterObj: function(isBinaryField, category, fName, label, value){ 
		
		/// Item objects in the popup
		this._listItems.push({
			"isBinaryField": isBinaryField,
			"fName": fName,
			"label": label,
			"value": value,
			"category": category
		});
	},
	
	/// 2nd step
	onAdd: function(map){
		this._initLayout();
		this._update();
		this._imgs = this._form.getElementsByTagName("img");
		
		return this._container;
	},
	
	_initLayout: function(){
		var className = "acert-control-filter";
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
		control.style.backgroundImage = this._icon;
		L.DomEvent.addListener(control, "click", this.showPopop, this);

		/// The list of sub-categories
		var form = this._form = L.DomUtil.create("form", "acert-control-form acert-control-hide"); /// List container
		
		/// Add close button
		var close = L.DomUtil.create("span", "acert-control-close", form);
		L.DomEvent.addListener(close, "click", this.hidePopup, this);
		close.title = "Close";
		
		/// Add reset button
		var reset = L.DomUtil.create("span", "acert-control-reset", form);
		L.DomEvent.addListener(reset, "click", this.resetFilter, this);
		reset.title = "Reset";
		
		/// Add clear button
		if(this._toolClear){
			var clear = L.DomUtil.create("span", "acert-control-clear", form);
			L.DomEvent.addListener(clear, "click", this.clearFilter, this);
			clear.title = "Clear";
		}
	
		this._filterList = {};		
		
		/// Create 'div' sections for different categories
		var isTop = true;
		for(var id = 0; id < this._categories.length; id ++){

			/// Add category label				
			var categoryLabel = L.DomUtil.create("label", "acert-control-filter-group-name", form);
			categoryLabel.innerHTML = this._categories[id];
			
			this._filterList[this._categories[id]] = L.DomUtil.create('div', "acert-control-filter-group", form);
			//this._filterList[this._categories[id]].id = this._categories[id].replace(/ /g, "-");
			
			isTop = false;
		}		
		
		container.appendChild(form);
	},
	
	showPopop: function () {
		this._show(this._form);
		this._hide(this._control);
	},
	
	hidePopup: function () {
		this._show(this._control);
		this._hide(this._form);
	},
	
	_update: function () {
		if (!this._container) {
			return;
		}

		for (var i = 0; i < this._listItems.length; i ++) {
			var obj = this._listItems[i];

			this._addItem(obj);					
		}
	},
	
	/// Create list items
	_addItem: function(obj, onclick) {

		var img = L.DomUtil.create("img", "acert-list-icon", this._filterList[obj.category]);
		img.category = obj.category;
		img.fName = obj.fName;
		img.value = obj.value;
		img.isBinaryField = obj.isBinaryField;
		
		/// The agency category is on by default
		/// The other categories are off by default
		if(obj.isBinaryField){
			img.toggle = false;
			img.src = "style/images/inactive/" + this._getIconName(obj) + ".png";
		} else {
			img.toggle = true;
			img.src = "style/images/active/" + this._getIconName(obj) + ".png";
		}
		
		img.title = obj.label;
		
		
		img.style.width = "32px";
		img.style.height = "32px";
		img.style.display = "inline-block";
		img.style.cursor = "pointer";
		img.style.margin = "5px";
		
		L.DomEvent.addListener(img, "click", this._onInputClick, this);

	},
	
	_onInputClick: function (evt) {
		var clickImg = evt.target || evt.srcElement;
		
		var imgs = this._imgs = this._form.getElementsByTagName("img");
		var objFilter = this._getObjFilter(clickImg, imgs);
		
		if (this._extraForm){
			var objExtraFilter = this._getObjFilter(clickImg, this._extraForm.getElementsByTagName("img"));
		}
		
		this._updateMap(L.Util.extend(objFilter, objExtraFilter));
		
	},
	
	_getObjFilter: function(clickImg, imgs){
		var objFilter = {};
		for (var i = 0; i < imgs.length; i ++) {
			var img = imgs[i];
			var iconName = this._getIconName(img);
			
			if (img == clickImg) {
				img.toggle = !img.toggle;
			}
			
			/// 
			if (img.toggle) {
				img.src = "style/images/active/" + iconName + ".png";
				var category = img.isBinaryField ? "default" : img.category;
				
				if(objFilter.hasOwnProperty(category)){
					objFilter[category].push({
						"fName": img.fName,
						"value": img.value,						
					})
				}else{
					objFilter[category] = [];
					objFilter[category].push({
						"fName": img.fName,
						"value": img.value,						
					})					
				}
				
			}else{
				img.src = "style/images/inactive/" + iconName + ".png";
			}
		}
		
		return objFilter; 
	},
	
	resetFilter: function(){
		if (!this._imgs) { return ;}
		
		for (var i = 0; i < this._imgs.length; i ++){
			var img = this._imgs[i];
			img.toggle = false;
			
			if(img.isBinaryField){
				img.toggle = false;
				img.src = "style/images/inactive/" + this._getIconName(img) + ".png";
			} else {
				img.toggle = true;
				img.src = "style/images/active/" + this._getIconName(img) + ".png";
			}
		}
		
		this._resetMap();
	},
	
	clearFilter: function(){
		if (!this._imgs) { return ;}
		
		for (var i = 0; i < this._imgs.length; i ++){
			var img = this._imgs[i];
			img.toggle = false;
			
			img.toggle = false;
			img.src = "style/images/inactive/" + this._getIconName(img) + ".png";
		}
		
		this._clearMap();
	},
	
	_getIconName: function (obj) {
		/// Identify the icon name
		if (obj.isBinaryField) {
			return obj.fName;
		} else {
			return obj.value.split("'")[1];
		}
	},
	
	_updateMap: function(objFilter) {
		if(this._map.wfsLayer){
			this._map.removeLayer(this._map.wfsLayer);
		}
		
		var wfsLayer = this._map.wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azacert", {
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
			filter: new PropertyFilter(objFilter) /// PropertyFilter class is defined in "Filter.js"
		});
		
		this._map.addLayer(wfsLayer);
	},
	
	_resetMap: function() {
		if(this._map.wfsLayer){
			this._map.removeLayer(this._map.wfsLayer);
		}
		
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
		
		this._map.addLayer(wfsLayer);
	},
	
	_clearMap: function() {
		if(this._map.wfsLayer){
			this._map.removeLayer(this._map.wfsLayer);
		}
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