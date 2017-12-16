/*********************************************************************************************
 * FILENAME: 		util_webservice.js
 * -------------------------------------------------------------------------------------------
 * AUTHOR/ID:		Tobias Schlereth (tolere7) / Florian Wolf (wolrin9)
 * OA:				ext. IDIS FH Wuerzburg, I/FP-41
 * -------------------------------------------------------------------------------------------
 * CREATION DATE:  	-
 * LAST CHANGE/BY: 	08.03.2013 (wolrin9)
 * -------------------------------------------------------------------------------------------
 * DESCRIPTION:		This file handles all communication with SAP - given a valid XML -
 * 					including login and Base64 decoding
 *********************************************************************************************/




//var lc_url = 'http://sap-d22.abatgroup.de:50000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/z_poc_services_addition/101/z_poc_services_addition/z_poc_services_addition?sap-client=101';
var lc_url = 'http://sap-d22.abatgroup.de:50000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zpoc_addition/101/zpoc_addition/zpoc_addition?sap-client=101';

//Implement Ajax Spinner (based on util_ajaxLoader.js)
$(document).ready( function(){
	
	$(document).ajaxStart(function(){
		showAjaxLoader();
	}).ajaxStop(function(){
		hideAjaxLoader();
	});
 
});

function getWebserviceCredentials() {
	
	var wsUrl;
	var host = window.location.host;	
	
	try {
		host = host.split('.')[0];
	} catch(err) {}
 	
 	//Which url is chosen depends on the host name.
 	//Warning: If the host is different from the two below, this solution will not work!
	
//		if(host == '')
//			if ( sessionStorage.getItem('oldLogin') == 'true' )  {
//				wsUrl = lc_url; 
//			} 
	wsUrl = lc_url
	
	var username = 'TPL'; 		//decrypt(sessionStorage.getItem('loginSAPUser'));
	var password = 'Elisabeth5%'; //decrypt(sessionStorage.getItem('loginSAPPassword'));
		
	return [wsUrl, username, password];
}

/**
 * Function calls an SAP webservice and returns the xml responded by SAP
 * @param {String} WSDL-URL
 * @param {String} SAP username
 * @param {String} SAP password
 * @param {String} XML webservice request
 * @param {String} callback function in case of success 
 * @param {String} callback function in case of failure
 * 
 */

function callWebservice(wsUrl, username, password, requestXML, successFunction, errorFunction) {

	var auth = make_base_auth(username, password);
	$.support.cors = true;
	
	if(sessionStorage.getItem('inDemo') == 'true')
	{		
		successFunction(webserviceMockup(requestXML));
	}
	else
	{
		$.ajax({
	
			url: wsUrl,
			type: "POST",
			dataType: "xml", 
			data: requestXML,
			contentType: "text/xml; charset=\"utf-8\"",
			
			success: function(data, success, xhr) {
				// parse xml to json
				var str = '';
				var json = '';
				
				try {											
					str = (new XMLSerializer()).serializeToString(data);	
						
				} catch(e) {
					
					try{
						//InternetExplorer fix
						str = data.xml;
					} catch(e) {
						showPopupByCode(710, 'E');
						return;
					}
				}
				
				var json = $.xml2json(str);
				//console.log(json); IE gives Object object
				var jsonShort;
				
				// IE fix
				if(json.Body == undefined) {
					
					// namespace in front of body-object
					jsonShort = json["soap_env:Body"];
					
					var keyName;
					var newName;
					
					// remove "n0:" in front of repsone name
					for(keyName in jsonShort){
	  					
	  					newName = keyName.replace("n0:", "");
	  					jsonShort[newName] = jsonShort[keyName];
	  					delete jsonShort[keyName];
	  					break;
					}
					
				}	
				else {
					jsonShort = json.Body;
				}
					
				//console.log(json.Body); IE gives undefined
				
				//test
				//console.log(stringifyJSON(jsonShort))
				
				//unpack json
				for (var key in jsonShort) {
    				jsonShort = jsonShort[key];
    				break;
				}
				
	        	successFunction(jsonShort);
	    	},
	    	
	    	beforeSend: function(xhr) {
	        	xhr.setRequestHeader('Authorization', auth);       	
	        	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	        	xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	        	xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
	        	xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
	        	xhr.setRequestHeader('Access-Control-Max-Age', 86400);
	        	xhr.setRequestHeader('Accept-Language', 'de-DE');
	    	},
			
	    	error: function(jqXHR, textStatus, errorThrown) {
	    		//hide spinner workaround - hide not executed in case of wrong credentials (Daniel)
	        	hideAjaxLoader();
	        	
	        	var errorMsg = '';
	        	/*console.log(jqXHR);
	        	console.log(jqXHR.status);
	        	console.log(jqXHR.responseText);*/
	        	
	        	//console.log(jqXHR);
	        	if(jqXHR.status == 401) {
	        		errorMsg = 'Fehler bei der Authentifizierung. <br />Bitte Benutzername und Passwort überprüfen.<br /> [Statuscode: 401/Unauthorized]';
	        	}
	        	else if(jqXHR.status == 403) {
	        		errorMsg = 'Fehler beim Aufruf des SAP Webservice.<br /> [Statuscode: 403/Forbidden]';
	        	}
	        	else if(jqXHR.status == 500) {
	        		errorMsg = 'Interner Fehler im Webservice/ABAP.<br /> [Statuscode: 500/Internal Server Error]';
	        	}
	        	
	        	//console.log(errorMsg);
	        	
	        	errorFunction(jqXHR, errorThrown, errorMsg);
	    	}
		});
	}//endif
}


/**
 * Function generates a valid SOAP XML-Request
 * @param {String} Method name of the corresponding function module
 * @param {Object} XML structure as jQuery Object
 * @return {String} SOAP XML-Request
 */
function generateRequest(methodName, $root) {
	
	// SOAP Header 
	var soapHeader = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions"><soapenv:Header/><soapenv:Body><urn:' + methodName + '>';
	var soapFooter = '</urn:' + methodName + '></soapenv:Body></soapenv:Envelope>';
	
	// to upper case
	var soapBody = $root.html().replace(/<\/?[a-z]+.*?>/g, function (m) { return m.toUpperCase(); });
	
	//workaroud ITEM -> item
	var soapBodyItem = soapBody.replace(/ITEM/g,"item");
	
	return soapHeader + soapBodyItem + soapFooter;
	//return soapHeader + soapBody + soapFooter;
	
	//test
	//console.log(methodName);
}


/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = {
    
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
        
		input = Base64._utf8_encode(input);
        
		while (i < input.length) {
            
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
            
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
            
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
            
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            
		}
        
		return output;
	},
    
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
        
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
		while (i < input.length) {
            
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
            
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
            
			output = output + String.fromCharCode(chr1);
            
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
            
		}
        
		output = Base64._utf8_decode(output);
        
		return output;
        
	},
    
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
        
		for (var n = 0; n < string.length; n++) {
            
			var c = string.charCodeAt(n);
            
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
            
		}
        
		return utftext;
	},
    
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
        
		while ( i < utftext.length ) {
            
			c = utftext.charCodeAt(i);
            
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
            
		}
        
		return string;
	}
    
};//END BASE64

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = Base64.encode(tok);
    return "Basic " +hash;
}