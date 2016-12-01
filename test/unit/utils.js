import {processArray,processObject,mapObject,formatList} from '../../src/utils';

describe('utils', () => {


	describe("#processArray", () => {

		it("should iterate over an array", () => {

			let test= [0,1,2,3];

			let result = [];

			processArray(test,(item,done) => {
				result.push(item);
				done();
			},(err) => {
				expect(result).to.deep.equal(test);
			});

		});

		it("should break when error occurs", () => {

			let test= [0,1,2,3];

			let result = [];

			processArray(test,(item,done) => {
				result.push(item)
				done(new Error("Oh no!"));
			},(err) => {
				expect(result).to.deep.equal([0]);
				expect(err).to.not.be.null;
			});

		});

		it("should callback when array is empty",() => {
			let called = false;
			processArray([],(k,v,d) => {
				called = true;
				d();
			},(err) => {
				expect(called).to.equal(false);

			})

		});
		

	});


	describe("#processObject",() => {
		it("should callback when object is null",() => {
			let called = false;
			processObject(null,(k,v,d) => {
				called = true;
				d();
			},(err) => {
				expect(called).to.equal(false);

			})

		});
	});


	describe("#formatList",() => {
		it("should format a list correctly",() => {
			
			expect(formatList(["one","two"])).to.deep.equal("one or two");
			expect(formatList(["one"])).to.deep.equal("one");
			expect(formatList(["one","two","three"])).to.deep.equal("one, two or three");

		});
	});

	describe("#mapObject",() => {
		it("should map values of an object to a new one",() => {

			mapObject({ foo: "bar", test: "res" },(key,value,done) => {

				done(value.toUpperCase());

			},(res) => {

				expect(res.foo).to.deep.equal("BAR");
				expect(res.test).to.deep.equal("RES");

			});

		});
	});

});