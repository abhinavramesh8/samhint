function clearAll() {
  uploaded_file_names = {};
  all_function_names = {};
  overridden_func_names = {};
  all_errors = [];
  warnCalls = {};
  funcsUnusedPar = [];
  scopeChain = [];
  assignments = [];
  assgnFile = undefined;
  funcList = {};
  overriden = {};
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
    var overCheck = document.getElementById('override_check').checked;
    var unusedCheck = document.getElementById('unused_params').checked;
    var wrongCheck = document.getElementById('mismatch_params').checked;
    var uncalledCheck = document.getElementById('uncalled_funcs').checked;
    if(overCheck) printOverridenFuncs();
    if(unusedCheck) printUnused();
    if(wrongCheck) printWrongCalls();
    if(uncalledCheck) printNotCalled();
    //printOverridden();
    //printWrongCalls();
    //printUnused();
    var suppErrs = document.getElementById('suppress').checked;
    if(!suppErrs) printErrors();
  }
}
