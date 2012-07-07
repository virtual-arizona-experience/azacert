/*
 * Author: Ryan Clark
 * 
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 * This class is only working for ACERT map
 * 'resources' variable is the resource items listed in popup 
 */

var jade = require("jade");

JadeContent = L.Class.extend({
	options: {
		maxWidth: 600
	},
	
	_setResources: function(/*Array of resources (in FilterJSON.js)*/rResources){
		var resources = rResources[0];
		
		for(var i = 1; i < rResources.length; i ++) {
			resources = resources.concat(rResources[i]);
		}
		
		this.options.resources = resources;
	},
	
	initialize: function(templateUrl, options) {
		L.Util.setOptions(this, options || {});
		
		/*Those items are defined in FilterJSON.js*/
		this._setResources([accessItems, infoItems, facilitiesItems, campingItems, trailsItems, naturalHistoryItems, waterSportsItems])
		
		var that = this;
		$.ajax({
			url: templateUrl,
			async: false,
			success: function(result) { that.jadeFn = jade.compile(result); }
		});
	},
	
	generateContent: function(feature) {
		return this.jadeFn(L.Util.extend({props: feature.properties}, {resources: this.options.resources}));
	},
	
	generatePopup: function(feature, options) {
		this.titleToggle = false;
		
		var popup;
		if (options.centered) { popup = this.popup = new L.Popup.Centered(options); }
		else { popup = this.popup = new L.Popup(options); }
		
		popup.setLatLng(feature.layer._latlng);
		popup.setContent(this.generateContent(feature));
		
		return popup;
	}
});
