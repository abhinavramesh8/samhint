function clearAll() {
  uploaded_file_names = {};
  all_function_names = {};
  overridden_func_names = {};
  document.getElementById('list').innerHTML = "";
  document.getElementById('check').style.display = "inline";
  document.getElementById('suppress-container').style.display = "inline";
}

function checkIt() {
  document.getElementById('list').innerHTML = "";
  var uploaded = false;
  for(var file_key in uploaded_file_names) {
    uploaded = true;
    break;
  }
  if(uploaded) {
    document.getElementById('check').style.display = "none";
    document.getElementById('suppress-container').style.display = "none";
    printOverridden();
    var suppErrs = document.getElementById('suppress').checked;
    if(!suppErrs) printErrors();
  }
}
