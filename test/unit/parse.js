import { parse } from '../../src/parse';
import { lex } from '../../src/lexer';
import example from "./example";
import { expect } from "chai";

describe("Parse", () => {
	

	let tokens = lex(example);

	console.log(JSON.stringify(parse(tokens),null,4));



});