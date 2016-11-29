import SureJS from '../../src/sure-js';

describe('sureJs', () => {

    

    describe('#minLength', () => {

    	let store = new SureJS();

    	store.parseSchema(`
            Test{

                #Schema1{
                    test: str(minLength=3)
                }
            }

        `);

        store.validate("Test","Schema1",{ test: "fo" },(err,res) => {
        	expect(err).to.not.be.null;
        	expect(res).to.be.null;
        })
        
        store.validate("Test","Schema1",{ test: "fooo" },(err,res) => {
        	expect(err).to.be.null;
        	expect(res).to.not.be.null;
        })
     

    });

    describe('#maxLength', () => {

    	let store = new SureJS();

    	store.parseSchema(`
            Test{

                #Schema1{
                    test: str(maxLength=5)
                }
            }

        `);

        store.validate("Test","Schema1",{ test: "foooo123o" },(err,res) => {
        	expect(err).to.not.be.null;
        	expect(res).to.be.null;
        })
        
        store.validate("Test","Schema1",{ test: "fo" },(err,res) => {
        	expect(err).to.be.null;
        	expect(res).to.not.be.null;
        })
     

    });

    describe('#trim', () => {

    	let store = new SureJS();

    	store.parseSchema(`
            Test{

                #Schema1{
                    test: str(trim=true)
                    test2: str(trim=false)
                }
            }

        `);

        store.validate("Test","Schema1",{ test: "test ", test2: "test " },(err,res) => {
        	expect(err).to.be.null;
        	expect(res.test).to.equal("test")
        	expect(res.test2).to.equal("test ")
        })
        


    });

})