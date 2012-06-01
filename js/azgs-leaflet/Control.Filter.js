L.Control.Filter = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	/// 1st step
	initialize: function(rFilterItems, options){
		L.Util.setOptions(this, options);
		
		this._listItems = []; /// Item objects in the popup
		this._groups = []; /// Section IDs in the popup
		
		var isRadio, formId;
		
		for(var i = 0; i < rFilterItems.length; i ++){
			this._groups.push("filter-group-" + i);		
			
			for(var j = 0; j < rFilterItems[i].length; j ++){				
				
				if(rFilterItems[i][j].vPairs.length == 1) {
					isRadio = true;
				}else{
					isRadio = false;
				}
				
				for(var k = 0; k < rFilterItems[i][j].vPairs.length; k ++){
					this._addFilterObj(isRadio, 
							"filter-group-" + i,
							rFilterItems[i][j].fName, 
							rFilterItems[i][j].vPairs[k].display, 
							rFilterItems[i][j].vPairs[k].value);
				}					
			}
			
		}
	},
	
	_addFilterObj: function(isRadio, group, fName, label, value){ /// name: field name in attribute table; label: the text shown in the popup
		
		/// Item objects in the popup
		this._listItems.push({
			"isRadio": isRadio,
			"fName": fName,
			"label": label,
			"value": value,
			"group": group
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
		var container = this._container = L.DomUtil.create("div", className); /// 
		
		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
		}
		
		var form = this._form = L.DomUtil.create('form', className + '-list'); /// List container
		
		if (this.options.collapsed) {
			L.DomEvent.addListener(container, 'mouseover', this._expand, this);
			L.DomEvent.addListener(container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container); /// Button
			link.href = '#';
			link.title = 'Layers';

			L.DomEvent.addListener(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

			this._map.on('movestart', this._collapse, this);
			
		} else {
			this._expand();
		}
		
		this._filterList = {};
		
		var isTop = true;
		for(var id in this._groups){
			if(!isTop){
				L.DomUtil.create('div', 'acert-control-filter-separator', form);
			}			
			this._filterList[this._groups[id]] = L.DomUtil.create('div', this._groups[id], form);
			
			isTop = false;
		}		
		
		container.appendChild(form);
	},
	
	_update: function () {
		if (!this._container) {
			return;
		}

		this._filterList.innerHTML = '';


		for (var i = 0; i < this._listItems.length; i ++) {
			var obj = this._listItems[i];

			this._addItem(obj);
						
		}
	},
	
	_addItem: function(obj, onclick) {
		var ele = document.createElement('label');
		var eleInput = document.createElement('input');	
		eleInput.type = obj.isRadio ? 'checkbox' : 'radio';
		eleInput.name = obj.group;
		eleInput.fName = obj.fName;
		eleInput.value = obj.value;
		
		L.DomEvent.addListener(eleInput, 'click', this._onInputClick, this);

		var eleLabel = document.createTextNode(' ' + obj.label);
		ele.appendChild(eleInput);
		ele.appendChild(eleLabel);

		this._filterList[obj.group].appendChild(ele);
	},
	
	_onInputClick: function () {
		///Change codes here
		var inputs = this._form.getElementsByTagName('input');
		var objPairs = {};

		for (var i = 0; i < inputs.length; i ++) {
			var input = inputs[i];
			
			if (input.checked) {
				if(input.value == "*"){ /// Wildcard "*" is to search for everything
					delete objPairs[input.fName];
				}else{
					objPairs[input.fName] = input.value;
				}
				
			}
		}
		
		this._updateMap(objPairs);
		
	},
	
	_updateMap: function(objPropsFilter) {
		if(this._map.wfsLayer){
			this._map.removeLayer(this._map.wfsLayer);
		}
		
		var wfsLayer = this._map.wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:ACERT", {
			pointToLayer: function(latlng) { 
				return new L.Marker(latlng, { 
					icon: new L.Icon({ 
						iconUrl: "style/images/logos/?Agency?png", 
						iconSize: new L.Point(40, 40) 
					}) 
				});
			},
			popupObj: new JadeContent("templates/example.jade"),
			popupOptions: { maxWidth: 1000, centered: true },
			hoverFld: "Name",
			filter: new PropertyFilter(objPropsFilter)
		});
		
		this._map.addLayer(wfsLayer);
	},
	
	
	_expand: function () {
		L.DomUtil.addClass(this._container, 'acert-control-filter-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace('acert-control-filter-expanded', '');
	}
})