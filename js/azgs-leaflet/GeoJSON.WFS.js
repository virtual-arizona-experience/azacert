/*
 * Author: Ryan Clark
 * Email: ryan.clark@azgs.az.gov
 * 
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 */

L.GeoJSON.WFS = L.GeoJSON.extend({
	initialize: function(serviceUrl, featureType, options) {
		options = options || {};
		L.GeoJSON.prototype.initialize.call(this, null, options);
		
		var wfsVersion = options.wfsVersion || "1.0.0";
		this.getFeatureUrl = serviceUrl + "?request=GetFeature&outputformat=json&version=" + wfsVersion + "&typeName=" + featureType;

		if (options.filter && options.filter.cql) { this.getFeatureUrl += "&CQL_FILTER=" + options.filter.cql; }
		else if (options.filter) { this.getFeatureUrl += "&" + options.filter; }
		
		this.on("featureparse", function(e) {
			
			//*Set default icon url and highlight icon url********************************************/
			/// The function to parse icon url
			var parseIconUrl = function(/*url string needs to be parsed*/url){
				if(!url) {return ;}
				
				if(url.split("?").length == 3) { ///If the the iconUrl contains two parameters (with '?')
					var baseUrl = url.split("?")[0];
					var imgName = e.properties[url.split("?")[1]].replace(/\s/g, "") + "." + url.split("?")[2];
					url = baseUrl + imgName;	
				}
				
				return url;
			};
			
			/// Apply the parseUrl function
			if(e.layer.hasOwnProperty("options")){
				if (e.layer.options.hasOwnProperty("icon")) {
					if(e.layer.options.icon.hasOwnProperty("options")) {
						e.layer.options.icon.options.iconUrl = parseIconUrl(e.layer.options.icon.options.iconUrl);
						if(e.layer.options.icon.options.iconHighlightUrl){
							e.layer.options.icon.options.iconHighlightUrl = parseIconUrl(e.layer.options.icon.options.iconHighlightUrl);
						}							
					}					
				}		
			}
			//****************************************************************************************/
			//****************************************************************************************/
			
			if (options.popupObj && options.popupOptions) {
				e.layer.on("click", function(evt) {
					if (e.layer._hoverControl._map){
						e.layer._hoverControl._map.removeControl(e.layer._hoverControl);
					}
					
					var popup = options.popupObj.generatePopup(e, options.popupOptions);
					e.layer._map.openPopup(popup);
					if (options.popupFn) { options.popupFn(e); }
				});			
			}
			else if (options.popupFld && e.properties.hasOwnProperty(options.popupFld)) {
				e.layer.bindPopup(e.properties[options.popupFld], { maxWidth: 600 });
			}
			if (options.hoverObj || options.hoverFld) {
				e.layer.on("mouseover", function(evt) {				
					//********************************************************************************/
					/// Set the highlight symbol
					if(this.options.icon.options.iconHighlightUrl){
						this._icon.src = this.options.icon.options.iconHighlightUrl;
						this._icon.style.width = this.options.icon.options.iconSize.x * 2 + "px";
						this._icon.style.height = this.options.icon.options.iconSize.x * 2 + "px";						
					}
					//********************************************************************************/					
					
					hoverContent = options.hoverObj ? options.hoverObj.generateContent(e) : e.properties[options.hoverFld] || "Invalid field name" ;
					hoverPoint = e.layer._map.latLngToContainerPoint(e.layer._latlng);
					e.layer._hoverControl = new L.Control.Hover(hoverPoint, hoverContent);
					e.layer._map.addControl(e.layer._hoverControl);	
				});
				e.layer.on("mouseout", function(evt) {
					//********************************************************************************/
					/// Remove the highlight symbol
					if (e.layer.options.icon.options.iconHighlightUrl){
						this._icon.src = this.options.icon.options.iconUrl;
						
						this._icon.style.width = this.options.icon.options.iconSize.x + "px";
						this._icon.style.height = this.options.icon.options.iconSize.x + "px";						
					}
					//********************************************************************************/	
					if (e.layer._hoverControl._map){
						e.layer._hoverControl._map.removeControl(e.layer._hoverControl);
					}					
				});
			}
			if (e.layer instanceof L.Marker.AttributeFilter) { e.layer.setIcon(e); }
		});
	},
	
	onAdd: function(map) {
		L.LayerGroup.prototype.onAdd.call(this, map);
		var that = this;
		this.getFeature(function() {
			that.addGeoJSON(that.jsonData);
		});
	},
	
	getFeature: function(callback) {
		var that = this;
		$.ajax({
			url: this.getFeatureUrl,
			type: "GET",
			success: function(response) {
				if (response.type && response.type == "FeatureCollection") {
					that.jsonData = response;
					callback();
				}				
			},
			dataType: "json"
		});
	}
});