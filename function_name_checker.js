all_function_names = {};
overridden_func_names = {};
function check_func_names(funcs, file_name) {
  for(var j = 0; j<funcs.length; j++) {
    func_name = funcs[j].name;
    if(func_name === "(empty)") continue;
    funcs[j].file = file_name;
    if(all_function_names[func_name]) {
      overridden_func_names[func_name] = true;
      all_function_names[func_name].push(funcs[j]);
    } else {
      all_function_names[func_name] = [funcs[j]];
    }
  }
}
