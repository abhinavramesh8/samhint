all_errors = [];
function checkForErrors(errs, file_name) {
  for(var i=0; i<errs.length; i++) {
    var err = errs[i];
    err.file = file_name;
    all_errors.push(err);
  }
}

function printErrors() {
  if(all_errors.length > 0) {
    var str = "The following errors were detected<br /><ol>";
    for(var k=0; k<all_errors.length; k++) {
      var err = all_errors[k];
      str = str + "<li>" + err.reason + "<br />";
      str = str + "File: " + err.file + "&nbsp;&nbsp;&nbsp;";
      str = str + "Line number: " + err.line + "</li>";
    }
    str += "</ol>";
    document.getElementById('list').innerHTML += str;
  }
}
