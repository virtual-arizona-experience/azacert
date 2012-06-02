DateFilter = L.Class.extend({
	initialize: function(dateFieldName, startDate, endDate, options) {
		L.Util.setOptions(this, options || {});
		
		function ISODateString(d){
			 function pad(n){return n<10 ? '0'+n : n;}		 
			 return d.getUTCFullYear()+'-' + pad(d.getUTCMonth()+1)+'-' + pad(d.getUTCDate())+'T' + pad(d.getUTCHours())+':' + pad(d.getUTCMinutes())+':' + pad(d.getUTCSeconds())+'Z';
		}
		
		this.fldName = dateFieldName;
		this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
		this.endDate = endDate instanceof Date ? endDate : new Date(endDate);
		this.cql = escape(this.fldName + " AFTER " + ISODateString(this.startDate) + " AND " + this.fldName + " BEFORE " + ISODateString(this.endDate));	
	}
});

PropertyFilter = L.Class.extend({
	initialize: function(objFilter){
		this._orGroup = [];
		this._andGroup = [];

		if (objFilter){
			for(var group in objFilter){
				if(group == "default"){
					for(var i = 0; i < objFilter[group].length; i ++){
						var obj = objFilter[group][i];
						this._andGroup.push(obj.fName + "=" + obj.value);
					}
				}else{
					for(var i = 0; i < objFilter[group].length; i ++){
						var obj = objFilter[group][i];
						this._orGroup.push(obj.fName + "=" + obj.value);
					}					
				}
			}					
		}
		
		this._generateCql();
	},

	_generateCql: function(){
		var cqlString;
		if(this._orGroup.length > 0 && this._andGroup.length > 0){
			this.cql = escape("(" + this._orGroup.join(" OR ") + ")" + " AND " + "(" +this._andGroup.join(" AND ") + ")");
		}else{
			this.cql = escape(this._orGroup.join(" OR ") || this._andGroup.join(" AND "))
		}	
	}
});