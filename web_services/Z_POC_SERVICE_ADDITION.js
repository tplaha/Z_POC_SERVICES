/* CALL Z_POC_SERVICE_ADDITION */
function wsReqAddition() {

     var credentials = getWebserviceCredentials();
     var requestXML = wsReqAdditionXML();

     callWebservice(credentials[0], credentials[1], credentials[2], requestXML,
                evRespAddition, errorFunction);
}

function wsReqAdditionXML() {

     var $root = $('<root />');
     
     
     $root.append($('<IV_A />').text('1'), 
    		      $('<IV_B />').text('2')
    		     );
     
     var lv_servicename = 'ZPOC_ADDITION'; 
     
     return generateRequest(lv_servicename, $root);
}

function evRespAddition(data) {

	var lv_sum = data;

}