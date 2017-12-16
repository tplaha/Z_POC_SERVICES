/*********************************************************************************************
 * FILENAME: 		util_verifyLogin.js
 * -------------------------------------------------------------------------------------------
 * AUTHOR/ID:		Florian Wolf (wolrin9)
 * OA:				ext. IDIS FH Wuerzburg, I/FP-41
 * -------------------------------------------------------------------------------------------
 * CREATION DATE:  	-
 * LAST CHANGE/BY: 	28.02.2013 (wolrin9)
 * -------------------------------------------------------------------------------------------
 * DESCRIPTION:		Checks if the user has access to the page. If not, show login screen.
 *********************************************************************************************/

function verifyLogin() {
	
	//Check if user is already logged in - if not => index.html
	$('body').css('display', 'none');
    
    if(sessionStorage.getItem('isLoggedIn') == 'true') {
    	$('body').css('display', 'block');
    } else {
    	if ( sessionStorage.getItem('oldLogin') == 'true' )  {
    		window.location.href='./index.html';
    	} else {
    		window.location.href='./index_v2.html';
    	}
    }
}
