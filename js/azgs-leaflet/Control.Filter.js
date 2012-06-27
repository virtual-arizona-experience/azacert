L.Control.Filter = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	/// 1st step
	initialize: function(rFilters, options){
		L.Util.setOptions(this, options);
		
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
		control.title = "control";
		L.DomEvent.addListener(control, "click", this.showPopop, this);

		/// The list of sub-categories
		var form = this._form = L.DomUtil.create("form", "acert-control-form acert-control-hide"); /// List container
		
		/// Add close button
		var close = L.DomUtil.create("img", "acert-control-close", form);
		close.src = "style/images/popup-close.png";
		close.style.float = "right";
		close.style.padding = "0px 5px";
		close.style.cursor = "pointer";
		L.DomEvent.addListener(close, "click", this.hidePopup, this);
		
		this._filterList = {};		
		
		/// Create 'div' sections for different categories
		var isTop = true;
		for(var id in this._categories){

			/// Add category label				
			var categoryLabel = L.DomUtil.create("label", "acert-control-filter-group-name", form);
			categoryLabel.innerHTML = this._categories[id];
			
			this._filterList[this._categories[id]] = L.DomUtil.create('div', "acert-control-filter-group", form);
			this._filterList[this._categories[id]].id = this._categories[id].replace(/ /g, "-");
			
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
		img.toggle = false;
		img.isBinaryField = obj.isBinaryField;
		
		img.src = "style/images/inactive/" + this._getIconName(obj) + ".png";
		img.style.width = "32px";
		img.style.height = "32px";
		img.style.display = "inline-block";
		img.style.cursor = "pointer";
		img.style.margin = "5px";
		
		L.DomEvent.addListener(img, "click", this._onInputClick, this);

	},
	
	_onInputClick: function (evt) {
		var clickImg = evt.target;
		
		var imgs = this._form.getElementsByTagName("img");
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
		
		this._updateMap(objFilter);
		
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
		
		var wfsLayer = this._map.wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:ACERT", {
			pointToLayer: function(latlng) { 
				return new L.Marker(latlng, { 
					icon: new L.Icon({ 
						iconUrl: "style/images/logos/?Agency?png", 
						iconSize: new L.Point(16, 16) 
					}) 
				});
			},
			popupObj: new JadeContent("templates/wfsIdentify.jade"),
			popupOptions: { maxWidth: 1000, centered: true },
			hoverFld: "Name",
			filter: new PropertyFilter(objFilter) /// PropertyFilter class is defined in "Filter.js"
		});
		
		this._map.addLayer(wfsLayer);
	},
	
	/// Expand the popup
	_show: function (dom) {
		if(dom.classList.contains("acert-control-hide")){
			dom.classList.remove("acert-control-hide")
		}
		
		dom.classList.add("acert-control-show");
	},
	
	/// Collapse the popup
	_hide: function (dom) {
		if(dom.classList.contains("acert-control-show")){
			dom.classList.remove("acert-control-show")
		}
		
		dom.classList.add("acert-control-hide");
	}
})