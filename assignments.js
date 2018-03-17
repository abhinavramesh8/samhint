var scopeChain = [];
var assignments = [];
var assgnFile;
function assgnProc(node) {
  var currentScope;
  if (createsNewScope(node)){
    scopeChain.push([]);
    if(node.params != null){
      var params = node.params;
      currentScope = scopeChain[scopeChain.length - 1];
      for(var i=0; i<params.length; i++) {
        currentScope.push(params[i].name);
      }
    }
  }
  if (node.type === 'VariableDeclarator'){
    currentScope = scopeChain[scopeChain.length - 1];
    currentScope.push(node.id.name);
  }
  if (node.type === 'AssignmentExpression'){
    assignments.push(node);
  }
}

function leaveProc(node){
  if (createsNewScope(node)){
    checkForLeaks(assignments, scopeChain);
    scopeChain.pop();
    assignments = [];
  }
}

function createsNewScope(node){
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program';
}

function checkForLeaks(assignments, scopeChain){
  for (var i = 0; i < assignments.length; i++){
    var assignment = assignments[i];
    var varName = assignment.left.name;
    if (!isVarDefined(assignments[i], scopeChain)){
      var str = "Global variable leak: " + varName + " " + " on line ";
      str += assignment.loc.start.line + " in file " + assgnFile;
      str += '<br />'
      document.getElementById('list').innerHTML += str;
    }
  }
}

function isVarDefined(varname, scopeChain){
  for (var i = 0; i < scopeChain.length; i++){
    var scope = scopeChain[i];
    if (scope.indexOf(varname) !== -1){
      return true;
    }
  }
  return false;
}

function assgnChecker(ast, srcFile) {
  document.getElementById('list').innerHTML += "<br />The following global variable leaks have been detected: <br />"
  assgnFile = srcFile;
  traverse(ast, assgnProc, leaveProc);
}

/*
function printScope(scope, node){
  var varsDisplay = scope.join(', ');
  if (node.type === 'Program'){
    console.log('Variables declared in the global scope:',
      varsDisplay);
  }else{
    if (node.id && node.id.name){
      console.log('Variables declared in the function ' + node.id.name + '():',
        varsDisplay);
    }else{
      console.log('Variables declared in anonymous function:',
        varsDisplay);
    }
  }
}
*/
