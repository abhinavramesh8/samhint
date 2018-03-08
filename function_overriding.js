var funcList = {};
var overriden = {};

function overriden_funcs(ast, srcName) {
  var globalFunc = -1;
  var globalLevel = true;
  var scopeArr = [];
  var enter = function(node) {
    if(node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      if(!node.belongsToObject) {
        scopeArr.push(0);
        if(globalLevel) {
          globalFunc++;
        }
        var funcName = node.id.name;
        var funcObj = {"file": srcName, "line": node.loc.start.line, "params_len": node.params.length};
        if(funcList[funcName]) {
          overriden[funcName] = funcList[funcName];
        } else {
          funcList[funcName] = {"global": [], "non_global": {}, "called": false};
          funcList[funcName].first_func = funcObj;
        }
        if(globalLevel) {
          (funcList[funcName]).global.push(funcObj);
        } else {
          var non_global_arr = ((funcList[funcName]).non_global)[globalFunc];
          if(!non_global_arr) {
            ((funcList[funcName]).non_global)[globalFunc] = [];
          }
          (((funcList[funcName]).non_global)[globalFunc]).push(funcObj);
        }
        globalLevel = false;
      }
    }
  };
  var leave = function(node) {
    if(node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      if(!node.belongsToObject) {
        scopeArr.pop();
        if(scopeArr.length === 0) {
          globalLevel = true;
        }
      }
    }
  }
  traverse(ast, enter, leave);
}

function printOverridenFuncs() {
  var str = "Warning. The following functions have been defined multiple times: <br />";
  str += "<ol>"
  for(var prop in overriden) {
    if(overriden.hasOwnProperty(prop)) {
      var funcEntity = overriden[prop];
      if(funcEntity.global.length > 1) {
        str = str + "<li>" + prop + "<br />";
        str = str + "<ul>";
        for(var k = 0; k<funcEntity.global.length; k++) {
          str = str + "<li>" + "File: " + funcEntity.global[k].file;
          str = str + ", Line: " + funcEntity.global[k].line + "</li>";
        }
        for(var prop_non in funcEntity.non_global) {
          if(funcEntity.non_global.hasOwnProperty(prop_non)) {
            var nonArr = funcEntity.non_global[prop_non];
            for(var m = 0; m<nonArr.length; m++) {
              str = str + "<li>" + "File: " + nonArr[m].file;
              str = str + ", Line: " + nonArr[m].line + "</li>";
            }
          }
        }
        str = str + "</ul></li>";
      }
      else {
        for(var prop_non in funcEntity.non_global) {
          if(funcEntity.non_global.hasOwnProperty(prop_non)) {
            var nonArr = funcEntity.non_global[prop_non];
            if(nonArr.length > 1) {
              str = str + "<li>" + prop + "<br />";
              str = str + "<ul>";
              break;
            }
          }
        }
        for(var prop_non in funcEntity.non_global) {
          if(funcEntity.non_global.hasOwnProperty(prop_non)) {
            var nonArr = funcEntity.non_global[prop_non];
            if(nonArr.length > 1) {
              for(var m = 0; m<nonArr.length; m++) {
                str = str + "<li>" + "File: " + nonArr[m].file;
                str = str + ", Line: " + nonArr[m].line + "</li>";
              }
              str = str + "--------------------------<br />"
            }
          }
        }
        str = str + "</ul></li>";
      }
    }
  }
  str += "</ol>";
  document.getElementById('list').innerHTML += str;
}


function printNotCalled() {
  var str = "Warning. The following functions have not been called even once: <br />";
  str += "<ol>";
  for(var prop in funcList) {
    if(funcList.hasOwnProperty(prop)) {
      var funcEntity = (funcList[prop]).first_func;
      if(overriden[prop]) continue;
      if(!funcList[prop].called) {
        str += "<li>";
        str = str + "Function: " + prop;
        str += "<br />";
        str = str + "File name: " + funcEntity.file;
        str += "<br />";
        str = str + "Line number: " + funcEntity.line;
        str += "<br />";
        str = str + "</li>";
      }

    }
  }
  str += "</ol>";
  document.getElementById('list').innerHTML += str;
}
