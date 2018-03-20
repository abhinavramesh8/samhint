var unsafeFuncUses = [];

var unsafeFuncs = ['eval'];

function unsafeFinder(ast, src) {
  traverse(ast, function(node) {
    if(node.type === 'CallExpression') {
      if(node.callee.type === 'Identifier') {
        if(unsafeFuncs.indexOf(node.callee.name) > -1) {
          var evalObj = {"name": node.callee.name, "file": src, "line": node.callee.loc.start.line};
          unsafeFuncUses.push(evalObj);
        }
      }
      else if(node.callee.type === 'MemberExpression') {
        if(node.callee.object.name === 'document' && /^write(ln)?$/.test(node.callee.property.name)) {
          var methName = node.callee.property.name;
          var evalObj = {"name": "document."+methName, "file": src, "line": node.callee.object.loc.start};
          unsafeFuncUses.push(evalObj);
        }
      }
    }
    else if(node.type === 'Identifier' && /^(inner)|(outer)HTML$/.test(node.name)) {
      var evalObj = {"name": node.name, "file": src, "line": node.loc.start.line};
      unsafeFuncUses.push(evalObj);
    }
  });
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
  }
}
