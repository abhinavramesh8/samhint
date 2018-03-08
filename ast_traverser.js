function traverse(node, func, leaveFunc) {
  func(node);
  for (var key in node) {
    if (node.hasOwnProperty(key)) {
      var child = node[key];
      if (typeof child === 'object' && child !== null) {

        if (Array.isArray(child)) {
          child.forEach(function(node) {
            traverse(node, func, leaveFunc);
          });
        } else {
          traverse(child, func, leaveFunc);
        }
      }
    }
  }
  if(leaveFunc) leaveFunc(node);
}
/*
function analyzeCode(code) {
  var ast = esprima.parse(code, {loc: true});
  var functionsStats = {};
  var addStatsEntry = function(funcName) {
    if (!functionsStats[funcName]) {
      functionsStats[funcName] = {calls: 0, declarations:0};
    }
  };

  traverse(ast, function(node) {
    if (node.type === 'FunctionDeclaration') {
      addStatsEntry(node.id.name);
      functionsStats[node.id.name].declarations++;
    } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      addStatsEntry(node.callee.name);
      functionsStats[node.callee.name].calls++;
    }
  });
  processResults(functionsStats);
}

function processResults(results) {
  for (var name in results) {
    if (results.hasOwnProperty(name)) {
      var stats = results[name];
      if (stats.declarations === 0) {
        console.log('Function', name, 'undeclared');
      } else if (stats.declarations > 1) {
        console.log('Function', name, 'decalred multiple times');
      } else if (stats.calls === 0) {
        console.log('Function', name, 'declared but not called');
      }
    }
  }
}
*/
