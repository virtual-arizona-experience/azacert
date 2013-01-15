/**
 * Author: Genhan Chen
 * Email: genhan.chen@azgs.az.gov
 * 
 * Summary:
 * 		There are two types of item array: binary type and multi-value type
 *		For binary type, only 1 item exists in the "vPairs" array
 *		For multi-value type, more than 1 items exist in the "vPair" array
 * Keys:
 * 		fName - the field name in the attribute table, whose value is used to filter the features
 * 		vPairs - the array of unique value and its label shown as the image tip
 * 		value - the unique value for this field; string type needs to be set like "'...'"
 *		label - the value used to be the image tip 		  	
 */

var agencyItems = [ {
	"fName" : "agency",
	"vPairs" : [ {
		"value" : "'AZGFD'",
		"label" : "Arizona Game and Fish Department"
	}, {
		"value" : "'BLM'",
		"label" : "The Bureau of Land Management"
	}, {
		"value" : "'SP'",
		"label" : "Arizona State Parks"
	}, {
		"value" : "'NPS'",
		"label" : "National Park Service"
	}, {
		"value" : "'USFS'",
		"label" : "USDA Forest Service"
	},{
		"value" : "'USFWS'",
		"label" : "U.S. Fish and Wildlife Service"
	},  {
		"value" : "'AOT'",
		"label" : "Regional Recreation Sites"
	}, {
		"value" : "'ADOT'",
		"label" : "Scenic Routes/Arizona Highways"
	}, {
		"value" : "'tribe'",
		"label" : "Tribal Communities"
	}, {
		"value" : "'art-culture'",
		"label" : "Arts and Culture"
	}, {
		"value" : "'observatory'",
		"label" : "Observatories"
	}, {
		"value" : "'tourist-info'",
		"label" : "Designated Arizona Tourist Information"
	}]
} ];

var artCultureItems = [ {
	"fName" : "museum",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Museum/Culture Center"
	} ]
} ];

var accessItems = [ {
	"fName" : "feearea",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Fee Area"
	} ]
}, {
	"fName" : "seasonalus",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Seasonal Use"
	} ]
}, {
	"fName" : "disabledac",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Disabled Access"
	} ]
}, {
	"fName" : "backcountr",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Backcountry Use Permit"
	} ]
} ];

var infoItems = [ {
	"fName" : "interpreti",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Interpretive Exhibits"
	} ]
}, {
	"fName" : "visitorinf",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Visitor Infomation"
	} ]
} ];

var facilitiesItems = [ {
	"fName" : "restrooms",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Restrooms"
	} ]
}, {
	"fName" : "drinkingwa",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Drinking Water"
	} ]
}, {
	"fName" : "dumpstatio",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Dump Station"
	} ]
}, {
	"fName" : "showers",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Showers"
	} ]
}, {
	"fName" : "electricho",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Electric Hookups"
	} ]
}, {
	"fName" : "picnicarea",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Picnic Area"
	} ]
} ];

var campingItems = [ {
	"fName" : "developedc",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Developed Campsites"
	} ]
}, {
	"fName" : "primitivec",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Primitive Camping"
	} ]
}, {
	"fName" : "groupcamp_",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Group Camp/Picnic"
	} ]
} ];

var trailsItems = [ {
	"fName" : "hikingtrai",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Hiking Trails"
	} ]
}, {
	"fName" : "bicycletra",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Bicycle Trails"
	} ]
}, {
	"fName" : "ohvtrails",
	"vPairs" : [ {
		"value" : "1",
		"label" : "OHV Trails"
	} ]
}, {
	"fName" : "equestrian",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Equestrian Trails"
	} ]
} ];

var naturalHistoryItems = [ {
	"fName" : "selfguided",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Self-Guided Tours"
	} ]
}, {
	"fName" : "historical",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Historical/Archaeological"
	} ]
}, {
	"fName" : "geological",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Geological/Natural Area"
	} ]
}, {
	"fName" : "wildlife_b",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Wildlife/Birding Viewing"
	} ]
}, {
	"fName" : "scenicview",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Scenic View"
	} ]
} ];

var waterSportsItems = [ {
	"fName" : "swimming_h",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Swimming/Hot Springs"
	} ]
}, {
	"fName" : "canoe_raft",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Canoe/Rafting"
	} ]
}, {
	"fName" : "fishing",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Fishing"
	} ]
}, {
	"fName" : "boatingfac",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Boating Facilities"
	} ]
}, {
	"fName" : "boating",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Boating"
	} ]
}, {
	"fName" : "watersport",
	"vPairs" : [ {
		"value" : "1",
		"label" : "Water Sport"
	} ]
} ];