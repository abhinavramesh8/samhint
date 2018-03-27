uploaded_file_names = {};
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files;
  expFiles = files;
  for (var i = 0, f; f = files[i]; i++) {
    if(!f.type.match('javascript.*') || uploaded_file_names[f.name]) continue;
    uploaded_file_names[f.name] = true;
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        JSHINT(e.target.result);
        var funcs = JSHINT.data().functions;
        var errs = JSHINT.data().errors;
        var ast = esprima.parse(e.target.result, {loc: true});
        document.getElementById('list').innerHTML += (theFile.name+'<br />');
        //check_func_names(funcs, theFile.name);
        if(errs) checkForErrors(errs, theFile.name);
        //name_funcs(ast);
        //overriden_funcs(ast, theFile.name);
        //paramsMatcher(ast, theFile.name);
        //paramsUser(ast, theFile.name);
        //var leakCheck = document.getElementById('global_leaks').checked;
        //if(leakCheck) assgnChecker(ast, theFile.name);
        if(document.getElementById('security_issues').checked) {
          unsafeFinder(ast, theFile.name, e.target.result);
        }
        //console.log(warnCalls);
      };
    })(f);
    reader.readAsText(f);
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
