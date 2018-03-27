document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    var secIssues = document.getElementById('security_issues');
    var evalToJSON = document.getElementById('eval-to-json-container');
    if(secIssues.checked) {
      evalToJSON.style.display = 'inline';
    }
    secIssues.addEventListener('change', function() {
      if(this.checked) {
        evalToJSON.style.display = 'inline';
      } else {
        evalToJSON.style.display = 'none';
      }
    });
  }
};


var unsafeFuncUses = [];
var newFiles = {};
var unsafeFuncs = ['eval'];

/*
function modifyFile(theFile, newContents) {
  var fileURL = URL.createObjectURL(theFile);
  var fileObj = new File(fileURL);
  fileObj.open("w");
  fileObj.write(newContents);
  fileObj.close();
  URL.revokeObjectURL(fileURL);
}
*/



function attachCode(ast) {
  var safetyObj = "var securityProviderGlobalNamespace = {};";
  var escafeFunc = "securityProviderGlobalNamespace.escapeHTML = function(str) {" +
                   'var div = document.createElement(\"div\");' +
                   "div.appendChild(document.createTextNode(str));" +
                   "return div.innerHTML; };";
  // var evalToJSONFunc = "/^\s*\{.*\}\s*$/gm.test(str) ? eval(str) : JSON.parse(str)";
  ast.body.unshift(esprima.parse(safetyObj + escafeFunc));
  // console.log(ast);
  return escodegen.generate(ast);
}

function makeEvalSafer(evalCall) {
  var argument = (evalCall.arguments)[0];
  var argVal;
  if(argument.type === 'Identifier') argVal = argument.name;
  else if(argument.type === 'Literal') argVal = argument.raw;
  var newArg = "/^\s*\{.*\}\s*$/gm.test(" + argVal + ") ? eval(" + argVal +
               ") : JSON.parse(" + argVal + ")";
  (evalCall.arguments)[0] = esprima.parse(newArg);
}

function downloadNew(fileName, text) {
  console.log('over hereeee');
  text = text.trim();
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function unsafeFinder(ast, src, code) {
  var unsafePresent = false;
  traverse(ast, function(node) {
    if(node.type === 'CallExpression') {
      if(node.callee.type === 'Identifier') {
        if(unsafeFuncs.indexOf(node.callee.name) > -1) {
          // console.log(node.arguments);
          unsafePresent = true;
          var evalObj = {"name": node.callee.name, "file": src, "line": node.callee.loc.start.line};
          // if(document.getElementById('eval-to-json').checked) makeEvalSafer(node);
          unsafeFuncUses.push(evalObj);
        }
      }
      else if(node.callee.type === 'MemberExpression') {
        if(node.callee.object.name === 'document' && /^write(ln)?$/.test(node.callee.property.name)) {
          unsafePresent = true;
          var methName = node.callee.property.name;
          var evalObj = {"name": "document."+methName, "file": src, "line": node.callee.object.loc.start};
          unsafeFuncUses.push(evalObj);
        }
      }
    }
    else if(node.type === 'Identifier' && /^(inner)|(outer)HTML$/.test(node.name)) {
      unsafePresent = true;
      var evalObj = {"name": node.name, "file": src, "line": node.loc.start.line};
      unsafeFuncUses.push(evalObj);
    }
  });
  if(document.getElementById('eval-to-json').checked && unsafePresent) {
    console.log('evaling');
    code = code.replace(/eval\((.*)\)/gm, "/^\s*\{.*\}\s*$/gm.test($1) ? JSON.parse($1) : eval($1)");
    code = code.replace(/(.*)HTML\s*=\s*(.*)\s*;/gm, "$1HTML = securityProviderGlobalNamespace.escapeHTML($2);");
    code = code.replace(/document.write\((.*)\)/gm, "document.write(securityProviderGlobalNamespace.escapeHTML($1))");
    code = code.replace(/document.writeln\((.*)\)/gm, "document.writeln(securityProviderGlobalNamespace.escapeHTML($1))");
    newFiles[src] = attachCode(esprima.parse(code, {loc: true}));
  }
}

function printUnsafe() {
  if(unsafeFuncUses.length > 0) {
    var str = "Warning. The following functions, methods, attributes are unsafe:<br />";
    str += "<ol>";
    for(var i=0; i<unsafeFuncUses.length; i++) {
      var unsafeObj = unsafeFuncUses[i];
      str += "<li>";
      str += unsafeObj.name;
      str += "<br />";
      str = str + "File name: " + unsafeObj.file;
      str += "<br />";
      str = str + "Line number: " + unsafeObj.line;
      str += "<br />";
      str = str + "</li>";
    }
    str += "</ol>";
    document.getElementById('list').innerHTML += str;

    var newFileExists = false;
    for(var prop in newFiles) {
      if(newFiles.hasOwnProperty(prop)) {
        newFileExists = true;
        break;
      }
    }

    if(newFileExists) {
      str = "<br /><br />Safer files for downloading: <br /><br />";
      for(var prop in newFiles) {
        if(newFiles.hasOwnProperty(prop)) {
          //newFiles[prop] = newFiles[prop].replace(/\"/g, '\\"');
          //newFiles[prop] = newFiles[prop].replace(/\'/g, "\\'");
          globalNewCode = newFiles[prop];
          // console.log(globalNewCode);
          str += "<button onclick=\"downloadNew(\'" + prop + "\',globalNewCode)\">" + prop + "</button><br /><br />";
        }
      }
      document.getElementById('list').innerHTML += str;
    }
    console.log('successful');
  }

}

/*

function escapeHTMLByHint(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

a = eval(str);
k = JSON.Parse(str);




*/
