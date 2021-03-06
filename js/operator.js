
var op_stack = [];
var lit_stack = [];
var op_tos = -1;
var lit_tos = -1;
var DUMMY = "result";


const operator = (tokens) => {
	var operators = ["Addition Arithmetic Operator", "Subtraction Arithmetic Operator", "Multiplication Arithmetic Operator", "Division Arithmetic Operator", "Modulo Arithmetic Operator", "MAX Operator", "MIN Operator", "AND Logical Operator", "OR Logical Operator", "XOR Logical Operator", "Comparing Logical Operator", "Comparing Logical Operator (Negated)", "NOT Logical Operator"];
	var an_flag = false;
	// if the first operator is there
	if(operators.includes(tokens[0].type)){
		op_stack.push({operator: tokens[0].type, operands: 0, max: (tokens[0].type === "NOT Logical Operator" ? 1 : 2)}); // push operator
		++op_tos;
		// error_prompt("Pushed into OP-Stack: " + tokens[0].lexeme);
		for(let i = 1; i < tokens.length; ++i){
			// check if an_flag is true
			if(an_flag){
				// if operator
				if(operators.includes(tokens[i].type)){
					op_stack.push({operator: tokens[i].type, operands: 0, max: (tokens[i].type === "NOT Logical Operator" ? 1 : 2)}); // push operator
					++op_tos;
					// error_prompt("Pushed into OP-Stack: " + tokens[i].lexeme);
					an_flag = false;
				}
				// check if its literal or variable
				else if(tokens[i].type.includes("Literal") || tokens[i].type.includes("Identifier")){
					lit_stack.push(tokens[i].type) // push literal
					++lit_tos;
					// error_prompt("Pushed into Literal-Stack: " + tokens[i].lexeme);
					if(op_tos !== -1) ++op_stack[op_tos].operands;
					an_flag = false;
				}

				// otherwise, throw error
				else{
					error_prompt("Expected Literal/Variable or Operator after AN");
					op_stack = [];
					op_tos = -1;
					lit_stack = [];
					lit_tos = -1;
					return ERROR;
				}
			}
			// if AN and there's one operand
			else if(tokens[i].type === "Multiple Arrity Conjunctor"){
				if(op_tos === -1 || op_stack[op_tos].operands === 1){
					// error_prompt("See AN");
					an_flag = true;
					// continue;
				}
				// return error
				else{
					error_prompt("Expected value before AN");
					op_stack = [];
					op_tos = -1;
					lit_stack = [];
					lit_tos = -1;
					return ERROR;
				}
			}
			// if operator
			else if(operators.includes(tokens[i].type)){
				// throw error
				if(op_tos !== -1 && op_stack[op_tos].operands === 1){
					error_prompt("Expected AN before " + tokens[i].lexeme);
					op_stack = [];
					op_tos = -1;
					lit_stack = [];
					lit_tos = -1;
					return ERROR;
				}
				else{
					op_stack.push({operator: tokens[i].type, operands: 0, max: (tokens[i].type === "NOT Logical Operator" ? 1 : 2)}); // push operator
					++op_tos;
					// error_prompt("Pushed into OP-Stack: " + tokens[i].lexeme);
				}
			}
			// if literal or variable
			else if(tokens[i].type.includes("Literal") || tokens[i].type.includes("Identifier")){
				if(op_tos !== -1 && op_stack[op_tos].operands === 1){
					error_prompt("Expected AN before " + tokens[i].lexeme);
					op_stack = [];
					op_tos = -1;
					lit_stack = [];
					lit_tos = -1;
					return ERROR;
				}
				else{
					lit_stack.push(tokens[i].type) // push literal
					++lit_tos;
					// error_prompt("Pushed into Literal-Stack: " + tokens[i].lexeme);
					if(op_tos !== -1) ++op_stack[op_tos].operands;
				}
			}
			// else not a valid syntax, throw error
			else{
				error_prompt("Invalid start of " + tokens[i].lexeme);
				op_stack = [];
				op_tos = -1;
				lit_stack = [];
				lit_tos = -1;
				return ERROR;
			}

			// check if the operator at tos of op_stack has already 2 operands
			if(op_tos !== -1){
				while(op_stack[op_tos].operands === op_stack[op_tos].max){
					//pop last 2 operands
					let popped = lit_stack.pop(); // (2nd operand)
					--lit_tos;
					// error_prompt("Popped from Literal-Stack: " + popped);
					if(op_stack[op_tos].max !== 1){
						popped = lit_stack.pop(); // (1st operand)
						--lit_tos;
						// error_prompt("Popped from Literal-Stack: " + popped);
					}
					popped = op_stack.pop(); // pop the operator in tos
					--op_tos;
					// error_prompt("Popped from OP-Stack: " + popped.operator);
					lit_stack.push(DUMMY); // push result of the operations (DUMMY in this case)
					++lit_tos;
					// error_prompt("Pushed into OP-Stack: result");
					if(op_tos === -1) break;
					op_stack[op_tos].operands += 1; // and add operand count for the latest operator
				} 
			}

			// if there's only one operand and no operators left
			if(op_stack.length === 0 && lit_stack.length === 1 && i === tokens.length - 1){
				// error_prompt("Correct Arithmetic Syntax");
				op_stack = [];
				op_tos = -1;
				lit_stack = [];
				lit_tos = -1;
				return FINISH;
			}

			// otherwise, throw error
			else if(op_stack.length === 0){
				error_prompt("Unexpected Statement after: " + tokens[i].lexeme);
				op_stack = [];
				op_tos = -1;
				lit_stack = [];
				lit_tos = -1;
				return ERROR;
			}

			else if(i === tokens.length - 1){
				error_prompt("Insufficient Operands for " + op_stack[op_tos].operator);
				op_stack = [];
				op_tos = -1;
				lit_stack = [];
				lit_tos = -1;
				return ERROR;
			}
			
		}

		if(op_stack.length === 1 && lit_stack.length === 0){
			error_prompt("Expected Literal/Variable/Operator after " + op_stack[op_tos].operator);
			op_stack = [];
			op_tos = -1;
			lit_stack = [];
			lit_tos = -1;
			return ERROR;
		}
	}

	// otherwise, ret pass
	else{
		return PASS;
	}
}