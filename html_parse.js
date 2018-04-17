function checkForFormEle(line) {
  return /<\s*\/?\s*form\s*/.test(line);
}

function openTag(tag) {
  return (tag.indexOf('/') == -1);
}

function checkForHiddenInput(line) {
  return /input.*hidden/.test(line);
}

csrfArr = [];

function checkForCSRF(lines, fileName) {
  var lineNum = 0;
  var linesLen = lines.length;
  var matched = false;
  var csrfVul = true;
  console.log(lines);
  for(var i=0; i<linesLen; i++) {
    var currMatch = checkForFormEle(lines[i]);
    if(currMatch) {
      console.log('form detected');
      if(!matched) {
        console.log('here');
        matched = {"tag": currMatch, "line": lineNum, "file": fileName};
      }
      else {
        console.log("djhgfjhsgdfhj");
        if(csrfVul) {
          console.log('kjdskjhsefhjkfew');
          csrfArr.push(matched);
          console.log(csrfArr);
          matched = false;
          csrfVul = true;
        }
      }
    } else {
      if(matched) {
        if(csrfVul) {
          if(checkForHiddenInput(lines[i])) csrfVul = false;
        }
      }
    }
    lineNum++;
    console.log(csrfVul);
  }
}

inlineJSUses = {};

function checkForInlineJS(src, fileName) {
  if(/<\s*script\s*>/.test(src)) {
    inlineJSUses[fileName] = true;
    var js_file_name = fileName.slice(0, -5) + "_script.js";
    console.log('over hereeee mannn');
    console.log(extractInline(src));
    newFiles[js_file_name] = extractInline(src);
    newFiles[fileName] = stripInline(src);
  }
}

function extractInline(src) {
  var str = src.match(/<\s*script\s*>.*<\s*\/\s*script\s*>/gm);
  str = str.join("\n");
  console.log('inline stuff');
  console.log(str);
  str = str.replace(/<\s*\/?\s*script\s*>/gm, "");
  console.log(str);
  return str;
}

function stripInline(src) {
  src = src.replace(/<\s*script\s*>.*<\s*\/\s*script\s*>/gm, "");
  return src;
}

function parseHTML(str, fileName) {
  var lines = str.match(/[^\r\n]+/g);
  // console.log(lines);
  checkForCSRF(lines, fileName);
  checkForInlineJS(str, fileName);
}
