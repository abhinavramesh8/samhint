var warnCalls = {};
var funcsUnusedPar = [];
function paramsMatcher(ast, srcName) {
  var addCall = function(funcCall) {
    var funcName = funcCall.callee.name;
    if(overriden[funcName]) return;
    funcCall.file = srcName;
    if(warnCalls[funcName]) {
      if(funcCall.arguments.length !== (warnCalls[funcName]).func.params_len)
        (warnCalls[funcName]).calls.push(funcCall);
    }
    else {
      var funcObj = funcList[funcName];
      funcObj.called = true;
      funcObj = funcObj.first_func;
      if(funcCall.arguments.length !== funcObj.params_len) {
        var wrongCall = {"func": null, "calls": []};
        wrongCall.func = funcObj;
        wrongCall.calls.push(funcCall);
        warnCalls[funcName] = wrongCall;
      }
    }
  };
  traverse(ast, function(node) {
    if(node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      addCall(node);
    }
  });
}

function printWrongCalls() {
  var wrong_exists = false;
  var prop;
  for(prop in warnCalls) {
    if(warnCalls.hasOwnProperty(prop)) {
      wrong_exists = true;
      break;
    }
  }
  if(wrong_exists) {
    var str = "Warning. The following function declarations and calls differ in number of parameters and arguments respectively: <br />";
    str += "<ol>";
    for(prop in warnCalls) {
      if(warnCalls.hasOwnProperty(prop)) {
        var decFunc = warnCalls[prop].func;
        var allCalls = warnCalls[prop].calls;
        str += "<br /><br />";
        str = str + "<li>Declared function: " + prop + ", File: " + decFunc.file;
        str = str + ", Line number: " + decFunc.line + ", Expects " + decFunc.params_len + " parameters" + "<ul><br/>";
        for(var l = 0; l<allCalls.length; l++) {
          var currCall = allCalls[l];
          str = str + "<li>File: " + currCall.file + ", ";
          str = str + "Line number: " + currCall.loc.start.line;
          str = str + ", Given " + currCall.arguments.length + " arguments" + "</li>";
          str += "<br />";
        }
        str += "</ul></li>";
      }
    }
    str += "</ol>";
    document.getElementById('list').innerHTML += str;
  }
}

function paramsUser(ast, srcName) {
  //console.log('hereeee');
  var scopeArr = [];
  var currScope;
  var enter = function(node) {
    if(node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      var funcParams = node.params;
      var funcObj = {"varUse":{}, "params": [], "varDecs": {}};
      for(var i=0; i<funcParams.length; i++) {
        var parameter = funcParams[i];
        funcObj.params.push(parameter.name);
        funcObj.varUse[parameter.name] = -1;
      }
      scopeArr.push(funcObj);
      //console.log(scopeArr);
    }

    else if(node.type === 'VariableDeclarator') {
      if(scopeArr.length > 0) {
        currScope = scopeArr[scopeArr.length-1];
        currScope.varDecs[node.id.name] = true;
        if(currScope.varDecs[node.id.name]) {
          currScope.varDecs[node.id.name]--;
        } else {
          currScope.varDecs[node.id.name] = -1;
        }
      }
    }
    else if(node.type === 'Identifier') {
      //console.log('Entering ', node.name)
      if(scopeArr.length > 0) {
        currScope = scopeArr[scopeArr.length-1];
        var idName = node.name;
        if(currScope.varUse[idName]) {
          currScope.varUse[idName]++;
        } else {
          currScope.varUse[idName] = 1;
        }
      }
      //console.log(scopeArr);
    }
    //console.log(scopeArr);
  };
  var leave = function(node) {
    //console.log('Leaving ', node.type);
    if(node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      //console.log(scopeArr);
      var currScope = scopeArr[scopeArr.length-1];
      var paramsArr = currScope.params;
      if(paramsArr.length > 0) {
        var paramsUnused = [];
        for(var i=0; i<paramsArr.length; i++) {
          if(!(currScope.varUse[paramsArr[i]])) {
            paramsUnused.push(paramsArr[i]);
          }
        }
        if(paramsUnused.length > 0) {
          var funcUnused = {};
          if(node.id) funcUnused["name"] = node.id.name;
          funcUnused["params"] = paramsUnused;
          funcUnused["line"] = node.loc.start.line;
          funcUnused["file"] = srcName;
          funcsUnusedPar.push(funcUnused);
        }
      }
      //console.log(scopeArr);
      //console.log(currScope);
      //console.log(scopeArr);
      if(scopeArr.length > 1) {
        var prevScope = scopeArr[scopeArr.length-2];
        //console.log(prevScope);
        //console.log(currScope);
        for(var prop in currScope.varUse) {
          //console.log(prop);
          if (currScope.varUse.hasOwnProperty(prop)) {
            //console.log(currScope.varUse[prop]);
            if((prevScope.varUse)[prop]) {
              (prevScope.varUse)[prop] += (currScope.varUse)[prop];
            } else {
              //console.log(prop);
              (prevScope.varUse)[prop] = (currScope.varUse)[prop];
            }
          }
        }
        //console.log(scopeArr[scopeArr.length-2]);
      }
      scopeArr.pop();
      //console.log(scopeArr);
    }

  };
  traverse(ast, enter, leave);
  //console.log(funcsUnusedPar);
}

function printUnused() {
  if(funcsUnusedPar.length > 0) {
    var str = "Warning. The following functions have unused parameters: <br />";
    str += "<ol>";
    for(var i=0; i<funcsUnusedPar.length; i++) {
      str += "<li>";
      str = str + "Function: " + funcsUnusedPar[i].name;
      str += "<br />";
      str = str + "File name: " + funcsUnusedPar[i].file;
      str += "<br />";
      str = str + "Line number: " + funcsUnusedPar[i].line;
      str += "<br />";
      var unusedParams = funcsUnusedPar[i].params;
      str += "Unused parameters: "
      for(var j=0; j<unusedParams.length; j++) {
        str = str + unusedParams[j] + " ";
      }
      str = str + "</li>";
    }
    str += "</ol>";
    document.getElementById('list').innerHTML += str;
  }
}
