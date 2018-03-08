function name_funcs(ast) {
  traverse(ast, function(node) {
    if(node.type === 'VariableDeclarator') {
      if(node.init.type === 'FunctionExpression') {
        node.init.id = {"name": node.id.name};
      }
    }
    else if(node.type === 'AssignmentExpression') {
      if(node.right.type === 'FunctionExpression') {
        if(node.left.type === 'Identifier') node.right.id = {"name": node.left.name};
        else if(node.left.type === 'MemberExpression') {
          node.right.id = {"name": node.left.property.name};
          node.right.belongsToObject = true;
        }

      }
    }
    else if(node.type === 'Property') {
      if(node.value.type === 'FunctionExpression') {
        node.value.id = {"name": node.key.name};
        node.value.belongsToObject = true;
      }
    }
  });
}
