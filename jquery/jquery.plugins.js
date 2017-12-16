/* Plugin IE8 FIX for val() returns placeholder */
$.fn.pVal = function(){
    var $this = $(this),
        val = $this.eq(0).val();
    if(val == $this.attr('placeholder'))
        return '';
    else
        return val;
}