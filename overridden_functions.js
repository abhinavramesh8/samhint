function printOverridden() {
  var overridden_exists = false;
  for(var overridden_func in overridden_func_names) {
    overridden_exists = true;
    break;
  }
  if(overridden_exists) {
    var str = "Warning. The following functions have been defined multiple times: <br />";
    str += "<ol>";
    for(var func_name in overridden_func_names) {
      var func_arr = all_function_names[func_name];
      str += "<br /><br />";
      str += "<li>" + func_name +"<ul><br/>";
      for(var l = 0; l<func_arr.length; l++) {
        var func = func_arr[l];
        str = str + "<li>File: " + func.file + "&nbsp;&nbsp;&nbsp;";
        str = str + "Line number: " + func.line + "</li>";
        str += "<br />";
      }
      str += "</ul></li>";
    }
    str += "</ol>";
    document.getElementById('list').innerHTML += str;
  }
}
