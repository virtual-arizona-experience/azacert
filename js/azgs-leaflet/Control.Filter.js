L.Control.Filter = L.Control.extend({
	options: {
		collapsed: true,
		position: "topright"
	},
	
	/// 1st step
	initialize: function(rFilterItems, options){
		L.Util.setOptions(this, options);
		
		this._listItems = []; ///Item objects in the popup
		
		for(var i = 0; i < rFilterItems.length; i ++){
			for(var j = 0; j < rFilterItems[i].length; j ++){
				for(var k = 0; k < rFilterItems[i][j].vPairs.length; k ++){
					this._addFilterObj(false, rFilterItems[i][j].fName, rFilterItems[i][j].vPairs[k].display, rFilterItems[i][j].vPairs[k].value);
				}					
			}
			
			if(i != rFilterItems.length - 1){
				this._addFilterObj(true);
			}			
		}
	},
	
	_addFilterObj: function(isSeparator, fName, label, value){ /// name: field name in attribute table; label: the text shown in the popup
		
		/// Item objects in the popup
		this._listItems.push({
			"isSeparator": isSeparator,
			"fName": fName,
			"label": label,
			"value": value
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
		
		this._filterList = L.DomUtil.create('div', className + '-overlays', form); /// Filter item list
		
		container.appendChild(form);
	},
	
	_update: function () {
		if (!this._container) {
			return;
		}

		this._filterList.innerHTML = '';


		for (var i = 0; i < this._listItems.length; i ++) {
			var obj = this._listItems[i];
			if(obj.isSeparator){
				this._addSeparator();
			}else{
				this._addItem(obj);
			}			
		}
	},
	
	_addItem: function(obj, onclick) {
		var ele = document.createElement('label');
		var eleInput = document.createElement('input');	
		eleInput.type = 'checkbox';
		eleInput.name = obj.fName;
		
		L.DomEvent.addListener(eleInput, 'click', this._onInputClick, this);

		var eleLabel = document.createTextNode(' ' + obj.label);
		ele.appendChild(eleInput);
		ele.appendChild(eleLabel);
		
		this._filterList.appendChild(ele);
	},
	
	_addSeparator: function() {
		var ele = document.createElement('label');
		var eleLabel = document.createTextNode("----------------");
		ele.appendChild(eleLabel);
		L.DomUtil.create('div', 'acert-control-filter-separator', this._filterList);
	},
	
	_onInputClick: function () {
		///Change codes here
		
		var i, input, obj,
			inputs = this._form.getElementsByTagName('input'),
			inputsLen = inputs.length;

		for (var i = 0; i < inputsLen; i ++) {
			input = inputs[i];
			

			if (input.checked) {
				console.log(input.name);
			} else {
				
			}
		}
	},
	
	_expand: function () {
		L.DomUtil.addClass(this._container, 'acert-control-filter-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace('acert-control-filter-expanded', '');
	}
})