/**
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 * 
 * Summary:
 * 		Generate a filter control docked on the right
 * Parameters:
 * 		rFilters - the filter objects,  array type; the format of each filter object is like: 
 * 													[{category : "<category name>", items : [<items array defined in FilterJSON.js>]}, 
 * 													{category : "<category name>", items : [<items array defined in FilterJSON.js>]}, ...]
 * 		options - include following parameters: icon - the icon image, string type, e.g. url('style/images/tools/filter.png')
 * 												toolClear - if has clear tool, boolean type
 * 												toolTip - the tip for this control, string type
 * Add-on properties:
 * 		_icon - the icon image for this control
 * 		_toolClear - if this control has clear tool
 * 		_toolTip - the tip for this control
 * 		filter - the filter object generated based on the image toggles; its format is like: 
 * 											{"...": [
 * 												{fName: "...", value: "..."}, 
 * 												{fName: "...", value: "..."}
 * 											]}
 * 		_listItems - array type; the format is like:
 * 							[{
 *								"isBinaryField": <boolean type>,
 *								"fName": <string type>,
 *								"label": <string type>,
 *								"value": <string type>,
 *								"category": <string type>
 *							}, {...}]
 * 		_categories - the array of category names, array type
 * 		_imgs - the array of image elements on the filter popup, array type
 * 		_container - the filter container, including the control button and popup, html element type
 * 		_control - the control button, html element type
 * 		_form - the container for all items in the popup, html element type
 * 		_filterList - the array of item group elements, array type
 * 		_extraFilters - the array of the external filters applied in this filter, array type 
 */

L.Control.Filter = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	_icon: "url('style/images/tools/filter.png')",
	_toolClear: false,
	_tooTip: "Select Categories",
	filter: null,
	_extraFilters: [],
	
	/** 
	 * Step 1: initialization
	 */
	initialize: function(rFilters, options){
		L.Util.setOptions(this, options);
		
		if(options){
			this._icon = options.icon || "url('style/images/tools/filter.png')";
			this._toolClear = options.toolClear || false;
			this._tooTip = options.toolTip || "Select Categories";			
		}
		
		this._listItems = []; /// Item objects in the filter popup
		this._categories = []; /// Section IDs in the filter popup
		
		var isBinaryField, formId;
		
		for(var i = 0; i < rFilters.length; i ++){
			this._categories.push(rFilters[i].category);
			var rFilterItems = rFilters[i].items;
			
			for(var j = 0; j < rFilterItems.length; j ++){				
				
				/// Identify if it works on multi binary fields or a multi-value field
				if(rFilterItems[j].vPairs.length == 1) {
					isBinaryField = true;
				}else{
					isBinaryField = false;
				}
				
				/// Save the filter items into _listItems array
				/// Each vPair is an item in the _listItems array
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
	
	/**
	 * Summary:
	 * 		Set external filter controls connected with this one
	 * Parameters:
	 * 		controls - external filter controls
	 */
	setRelatedControl: function(controls){
		for (var i = 0; i < controls.length; i ++){
			this._extraFilters.push(controls[i].filter);
		}
	},
	
	/**
	 * Summary:
	 * 		Add filter object into _listItem array
	 * Parameters:
	 * 		isBinaryField - identify if this is a binary field, boolean type
	 * 		category - the category this item belongs to, string type
	 * 		fName - field name in attribute table, string type
	 * 		label - the text tip for the image, string type
	 * 		value - the unique value for this attribute field
	 */ 
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
	
	/**
	 * Step 2: set the filter layout when the control is added onto the map
	 */
	onAdd: function(map){
		this._initLayout();
		this._update();
		this._imgs = this._form.getElementsByTagName("img"); /// Initialize the array of image elements
		this.filter = this._getObjFilter(null, this._imgs);

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
		
		/// Add clear button based on the boolean value of _toolClear property
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
			
			isTop = false;
		}		
		
		container.appendChild(form);
	},
	
	showPopop: function () {
		this._show(this._form);
		this._hide(this._control);
		
		/**
		 * Make the filter control/popup draggable
		 */ 
		$(".acert-control-filter").draggable({ cursor: 'move'});
	},
	
	hidePopup: function () {
		this._hide(this._form);	
		
		/**
		 * Put the dragged filter control/popup back to the original place
		 */
		this._container.style.left = 0;
		this._container.style.top = 0;
		
		this._show(this._control);
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
	
	/**
	 * Summary:
	 * 		Add items into each group on the filter popup
	 * Parameters:
	 * 		obj - an item in the _listItems array
	 */
	_addItem: function(obj) {

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
		
		
		img.style.width = "24px";
		img.style.height = "24px";
		img.style.display = "inline-block";
		img.style.cursor = "pointer";
		img.style.margin = "5px";
		
		L.DomEvent.addListener(img, "click", this._onInputClick, this);

	},
	
	/**
	 * Summary:
	 * 		Click image to show/hide the related features on the map
	 * Parameters:
	 * 		evt - click event
	 */	
	_onInputClick: function (evt) {
		var clickImg = evt.target || evt.srcElement;
		
		var imgs = this._imgs = this._form.getElementsByTagName("img");
		var objFilter = this.filter = this._getObjFilter(clickImg, imgs);
		
		/**
		 * Connect with the external filters
		 */
		for (var i = 0; i < this._extraFilters.length; i ++){
			objFilter = L.Util.extend(objFilter, this._extraFilters[i]);
		}
		
		this._updateMap(objFilter);
		
	},
	
	/**
	 * Summary:
	 * 		Generate the filter object
	 * Parameters:
	 * 		clickImg - the clicked image element, html element type
	 * 		imgs - all the image html elements, array type
	 */
	_getObjFilter: function(clickImg, imgs){
		var objFilter = {};
		for (var i = 0; i < imgs.length; i ++) {
			var img = imgs[i];
			var iconName = this._getIconName(img);
			
			/// Change the toggle attribute for this image
			if (clickImg ? (img == clickImg) : false) {
				img.toggle = !img.toggle;
			}
			
			/// Generate the filter objects based on the toggle value for all the images
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
	
	/**
	 * Summary:
	 * 		Get the name of the icon, which will be used to identify the icon image
	 * 		For binary data, the field name will be used to identify the image url
	 * 		For multi-value data, the attribute value will be used to identify the image url
	 * Parameters:
	 * 		obj - an item in the _listItems array
	 */
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