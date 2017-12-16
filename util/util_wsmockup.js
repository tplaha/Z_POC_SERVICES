/*********************************************************************************************
 * FILENAME: 		util_wsmockup.js
 * -------------------------------------------------------------------------------------------
 * AUTHOR/ID:		Florian Wolf (wolrin9)
 * OA:				ext. IDIS FH Wuerzburg, I/FP-41
 * -------------------------------------------------------------------------------------------
 * CREATION DATE:  	-
 * LAST CHANGE/BY: 	28.02.2013 (wolrin9)
 * -------------------------------------------------------------------------------------------
 * DESCRIPTION:		Provides demo data for testing purposes only
 * 					Für Umwandlung von JSON zu XML-Datei zum speicher kann die 
 * 					Funktion JSON.stringify(param) verwendet werden
 * 					Die Eclipsefunktion "Source->Format" macht dann ein schönes 
 * 					XML daraus
 *********************************************************************************************/

var demoOrder = '';

function webserviceMockup(xml) {
	
	var retJson;
	if (xml.indexOf("_-VWK_-EAM_SUI_GET_MY_CONF_LIST") != -1) {
		orderFile = "my_conf_list.json";
		retJson = $.parseJSON(readFile(orderFile));		
	} 
	else if (xml.indexOf("_-VWK_-EAM_SUI_CHECK_KOSTL") != -1) {
		orderFile = "checkKostl.json";
		retJson = $.parseJSON(readFile(orderFile));
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_PERS_INFO") != -1) {
		orderFile = "pers_info.json";
		retJson = $.parseJSON(readFile(orderFile));
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_CHANGE_PASSW") != -1) {
		//orderFile = "pass_change.json"; 
		orderFile = "pass_change_err.json";
		retJson = $.parseJSON(readFile(orderFile));
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_TREX_FIND_OBJECTS") != -1) {
		orderFile = "trex.json";
		retJson = $.parseJSON(readFile(orderFile));
		/*
		var trexJson = $.parseJSON(TREX_FIND_OBJECTS);
		var array = trexJson.__VWK__EAM_SUI_TREX_FIND_OBJECTSResponse.ET_RESULT.item;
		var random = Math.random();
		var randomStart = parseInt(array.length * random * random);
		var randomEnd = parseInt(array.length * random);
		trexJson.__VWK__EAM_SUI_TREX_FIND_OBJECTSResponse.ET_RESULT.item = array.splice(randomStart, randomEnd);		
		retJson = trexJson;
		*/
	} 
	else if (xml.indexOf("_-VWK_-EAM_SUI_NOTIFICATION_INFO") != -1) {	
		orderFile = "notification.json";
		retJson = $.parseJSON(readFile(orderFile));		
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_ORDER_LIST") != -1) {
		orderFile = "order_list.json";
		retJson = $.parseJSON(readFile(orderFile));
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_OTHER_LIST") != -1) {
		orderFile = "other_list.json";
		retJson = $.parseJSON(readFile(orderFile));
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_ORL_BY_TECHOB") != -1) {
		orderFile = "facilityinfo.json";
		retJson = $.parseJSON(readFile(orderFile));
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_MORE_CON_DATA") != -1) {
		orderFile = "more_con_data.json";
		retJson = $.parseJSON(readFile(orderFile));
	}		
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_COMPL_CONF") != -1)
		retJson = $.parseJSON(getComplConfOrder());
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_ORDER_TECHINF") != -1) {
		orderFile = "order_techinf.json";
		retJson = $.parseJSON(readFile(orderFile));
	}		
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_PRIO_LIST") != -1) {
		retJson = $.parseJSON(getRandomPrio());
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_LART_LIST") != -1) {		
		retJson = $.parseJSON(getRandomLart());
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_GET_ORDER") != -1) {
		retJson = $.parseJSON(getOrder());
	}
	else if (xml.indexOf("_-VWK_-EAM_SUI_PRINT_ORDER2") != -1) {		
		orderFile = "print_order.json";
		retJson = $.parseJSON(readFile(orderFile));
	} else if (xml.indexOf("_-VWK_-EAM_SUI_GET_DOCUMENTS") != -1) {
		orderFile = "documents.json";
		retJson = $.parseJSON(readFile(orderFile));
	} else if (xml.indexOf("_-VWK_-EAM_SUI_MAT_USED_LIST") != -1) {
		orderFile = "matused.json";
		retJson = $.parseJSON(readFile(orderFile));
	} else if (xml.indexOf("_-VWK_-EAM_SUI_GET_OBJECT_DATA") != -1) {
		orderFile = "detail.json";
		retJson = $.parseJSON(readFile(orderFile));
	} else if (xml.indexOf("_-VWK_-EAM_SUI_MAT_SEARCH_LIST") != -1) {		
		orderFile = "matsearch.json";
		retJson = $.parseJSON(readFile(orderFile));		
	} else if (xml.indexOf("_-VWK_-EAM_SUI_GET_ARBPL_LIST") != -1) {		
		orderFile = "arbplList.json";		
		retJson = $.parseJSON(readFile(orderFile));
	} else if (xml.indexOf("_-VWK_-EAM_SUI_CALC_PRIO_END") != -1) {		
		retJson = $.parseJSON(getRandomPrioCalc());
	} else if (xml.indexOf("_-VWK_-EAM_SUI_PRINT_PAPERS") != -1) {		
		orderFile = "paperList.json";		
		retJson = $.parseJSON(readFile(orderFile));		
	} else if (xml.indexOf("_-VWK_-EAM_SUI_GET_BOM_DATA") != -1) {		
		orderFile = "bomList.json";		
		retJson = $.parseJSON(readFile(orderFile));		
	} else if (xml.indexOf("_-VWK_-EAM_SUI_GET_USER_STATUS") != -1) {		
		orderFile = "statusList.json";		
		retJson = $.parseJSON(readFile(orderFile));		
	} else if (xml.indexOf("_-VWK_-EAM_SUI_MAINT_USERSTAT") != -1) {	
		orderFile = "statusMaintResp.json";		
		retJson = $.parseJSON(readFile(orderFile));		
	} else if (xml.indexOf("_-VWK_-EAM_SUI_CHANGE_TECOBJ") != -1) {	
		orderFile = "changeTecObj.json";		
		retJson = $.parseJSON(readFile(orderFile));		
	} else if (xml.indexOf("_-VWK_-EAM_SUI_CHANGE_ILMKZ") != -1) {	
		orderFile = "ILMKz.json";		
		retJson = $.parseJSON(readFile(orderFile));		
	} else {			
		var str = xml.substring(xml.lastIndexOf('urn:') + 4, xml.length);
		str = str.substring(0, str.indexOf('>'));
		strResp = str.replace(/\-/g, '_') + 'Response';
		var data = '{"' + strResp + '":{"ES_MESSAGE":{"MSG_TYPE":"S","MSG_TEXT":"Erfolgreich"}}}';
		data = $.parseJSON(data);
		retJson = data;
	}
	
	//unpack json
	for (var key in retJson) {
		retJson = retJson[key];
		break;
	}

	return retJson;
}

function getOrder() {//not so random anymore
	
	if (demoOrder == 'many') {// viele vorgänge
		orderFile = "order2.json";
	}
	else if (demoOrder == 'one') {//ein vorgang
		orderFile = "order3.json";
	}
	else if (demoOrder == 'none') {//kein vorgang
		orderFile = "order4.json";
	}
	else if (demoOrder == 'error') { //fehlermeldung
		orderFile = "order5.json";
	}
	else {
		orderFile = "order.json";
	}
	
	return readFile(orderFile);
}

function readFile(file) {
	var strout;
	var urlString = "Testdateien/" + orderFile;
	
	$.ajax({
		type : "GET",
		async : false,
		url : urlString,
		dataType : "text",
		success : function(data, textStatus, jqXHR) {
			// `text` is the file text			
			strout = data;
		},
		error : function() {
			// An error occurred
		}
	});	
	return strout;
}

function readFileJson(file) {
	var strout;
	var urlString = "Testdateien/" + orderFile;
	$.ajax({
		type : "GET",
		async : false,
		url : urlString,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		
		success : function(data, textStatus, jqXHR) {
			// `text` is the file text			
			strout = data;					
			
		},
		error : function() {
			// An error occurred
		}
	});
	
	return strout;
}

function getComplConfOrder() {//not so random anymore

	if (demoOrder == 'many') {// viele vorgänge
		orderFile = "complConfOrder.json";
	}
	else if (demoOrder == 'one') { //ein vorgang
		orderFile = "complConfOrder2.json";
	}
	else if (demoOrder == 'none') { //kein vorgang
		orderFile = "complConfOrder3.json";
	}
	else if (demoOrder == 'error') { //fehlermeldung
		orderFile = "complConfOrder4.json";
	}
	else { //todo (mehr material etc)
		orderFile = "complConfOrder5.json";
	}

	return readFile(orderFile);
}

function getRandomPrioCalc() {
	var random = Math.random();

	if (random <= 0.5) {
		orderFile = "prioCalc.json";
	} else {
		orderFile = "prioCalc2.json";
	}
		
	return readFile(orderFile);
}

function getRandomPrio() {
	var random = Math.random();

	if (random <= 0.3) {
		orderFile = "prioList.json";
	}	
	else if (random > 0.3 && random < 0.7) {
		orderFile = "prioList2.json";
	}
	else {
		orderFile = "prioList3.json";
	}
		
	return readFile(orderFile);
}

function getRandomLart() {
	var random = Math.random();

	if (random <= 0.5) {
		orderFile = "lartList.json";
	}	
	else {
		orderFile = "lartList2.json";
	}	
	return readFile(orderFile);
}
