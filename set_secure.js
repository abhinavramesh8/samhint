setUnsafeUses = [];

function checkForSetFunc(node, fileName, srcCode) {
  if(node.callee.name === 'setTimeout' || node.callee.name === 'setInterval') {
    var argOne = (node.arguments[0]).type;
    if(argOne !== 'FunctionExpression') {
      var setObj = {"name": node.callee.name, "file": fileName, "line": node.callee.loc.start.line};
      setUnsafeUses.push(setObj);
      newFiles[fileName] = replaceSet(srcCode);
    }
  }
}

function replaceSet(src) {
  src = src.replace(/setTimeout\((\".*\")\s*,/gm, "setTimeout(function() {\n$1},");
  src = src.replace(/setInterval\((\".*\")\s*,/gm, "setTimeout(function() {\n$1},");
  return src;
}
