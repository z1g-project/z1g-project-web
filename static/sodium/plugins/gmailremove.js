function yourFunction() {
 
  if ( jQuery("div.ya") == null ) {
    setTimeout(function() { yourFunction(); }, 1000);
  } else {
    jQuery('span:contains("Empty Trash now")').parent().hide();
  }
 
}
setTimeout(function() { yourFunction(); }, 3000);