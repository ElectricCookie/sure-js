import { lex } from '../../src/lexer';

import { expect } from "chai";

import example from "./example";

describe("Parse", () => {

	describe("#lex",() => {


		console.log(lex(example).map((token) => { return token.type+": "+token.value}))


	});

});