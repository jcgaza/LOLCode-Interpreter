'use strict';

var symbol_table = [{
  name: "IT",
  type: "NOOB",
  value: null
}];

var tokens_cpy = "";

var result = null;
const runCode = () => {
  clear_tables();
  display("Running code...<br>");
  get_lines();
  while (lines.length !== 0) {
    if(lines[0] === ""){
      lines.shift();
      continue;
    }

    var tokens = lexical_analyzer();
    tokens_cpy = tokens.slice();
    if(tokens !== ERROR && tokens.length !== 0){
      if(!syntax_analyzer(tokens)){
        result = ERROR;
        break;
      }
      else{
        render_symbol_table();

        if (!waiting && tokens_cpy[0].lexeme !== "OIC" && !semantic_analyzer(tokens_cpy)){
          result = ERROR;
          break;
        }
      }
    }
    else if(tokens === ERROR){
      result = ERROR;
      break;
    }
  }


  if(result !== ERROR){
    // for O RLY block
    if(lines.length === 0 && ifelse_stack.length !== 0){
      display("O RLY block is INCOMPLETE");
    }

    // for WTF? Block
    if(lines.length === 0 && switchcase_stack.length !== 0){
      display("WTF? block is INCOMPLETE");
    }
    if(startDelimiter && !endDelimiter){
      display("KTHXBYE not met");
    }
    if(multiLineCommentTrigger){
      display("Missing TLDR");
    }
  }
  ifelse_tos = -1;
  ifelse_stack = [];
  waiting = false;
  waiting_block = null;
  switchcase_tos = -1;
  switchcase_stack = [];
  waiting = false;
  waiting_block = null;
  startDelimiter = false;
  endDelimiter = false;
  multiLineCommentTrigger = false;
  result = null;

}


const token_table = (message) => {
  document.getElementById("tokenTable").innerHTML += message;
}


const clear_tables = () => {
  document.getElementById("tokenTable").innerHTML = "";
  document.getElementById("consoleArea").innerHTML = "";
  document.getElementById("symbolTable").innerHTML = "";
  symbol_table = [{
  name: "IT",
  type: "NOOB",
  value: null
}];
}

const render_symbol_table = () => {
  var symbolTableContent = "";
    for(let i = 0; i < symbol_table.length; ++i){
        symbolTableContent = symbolTableContent + "<tr><td>" + symbol_table[i].name + "</td><td>" + symbol_table[i].type + "</td><td>" + symbol_table[i].value + "</td></tr>";
    }

    document.getElementById("symbolTable").innerHTML = symbolTableContent;
}
