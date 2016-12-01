import SureJS from '../../src/sure-js';

describe('sureJs', () => {

    

    describe('#min', () => {


        let store = new SureJS();

        store.parseSchema(`
            Test{

                #Schema1{
                    test: nr(min=3)
                }
            }

        `);

        it("should catch a number being too small",() => {
            store.validate("Test","Schema1",{ test: 1 },(err,res) => {
                expect(err).to.not.be.null;
                expect(res).to.be.null;
            });   
        });

        it("should pass a number that is big enough", () => {
            store.validate("Test","Schema1",{ test: 5 },(err,res) => {
                expect(err).to.be.null;
                expect(res).to.not.be.null;
            });
        });
    });


    describe('#max', () => {

        let store = new SureJS();


        store.parseSchema(`
            Test{

                #Schema1{
                    test: nr(max=3)
                }
            }

        `);

        it("should detect a number that is too big",() => {
            store.validate("Test","Schema1",{ test: 5 },(err,res) => {
                expect(err).to.not.be.null;
                expect(res).to.be.null;
            })
        });

        it("should pass a number that is small enough",() => {
            store.validate("Test","Schema1",{ test: 1 },(err,res) => {
                expect(err).to.be.null;
                expect(res).to.not.be.null;
            });
        });

    });

    describe('#floor', () => {

        it("should floor a number to the given amount of decimal places",() => {

            let store = new SureJS();

            store.parseSchema(`
                Test{

                    #Schema1{
                        test: nr(floor=0)
                        foo: nr(floor=1)
                    }
                }

            `);

            store.validate("Test","Schema1",{ test: 5.3, foo: 5.31 },(err,res) => {
                expect(err).to.be.null;
                expect(res.test).to.equal(5);
                expect(res.foo).to.equal(5.3);
            })

        });
        

    });

    describe('#round', () => {

        it("should round a number to the given amount of decimal places",() => {

            let store = new SureJS();

            store.parseSchema(`
                Test{

                    #Schema1{
                        test: nr(round=0)
                        foo: nr(round=0)
                    }
                }

            `);

            store.validate("Test","Schema1",{ test: 5.3, foo: 5.6 },(err,res) => {
                expect(err).to.be.null;
                expect(res.test).to.equal(5);
                expect(res.foo).to.equal(6);
            })

        });
        
    });
    
    describe('#ceil', () => {


        it("should round a number to the given amount of decimal places",() => {

            let store = new SureJS();

            store.parseSchema(`
                Test{

                    #Schema1{
                        test: nr(ceil=0)
                        foo: nr(ceil=1)
                    }
                }

            `);

            store.validate("Test","Schema1",{ test: 5.3, foo: 5.45 },(err,res) => {
                expect(err).to.be.null;
                expect(res.test).to.equal(6);
                expect(res.foo).to.equal(5.5);
            });


        });
        
    });

    describe('#allowDecimals', () => {

        it("should allow a number that has decimals",() => {

            let store = new SureJS();

            store.parseSchema(`
                Test{

                    #Schema1{
                        test: nr(allowDecimals=true)
                    }
                }

            `);

            store.validate("Test","Schema1",{ test: 5.3 },(err,res) => {
                expect(err).to.be.null;
                expect(res.test).to.equal(5.3);
            });

        });

        it("should not allow a number that has decimals",() => {


            let store = new SureJS();

            store.parseSchema(`
                Test{

                    #Schema1{
                        test: nr(allowDecimals=false)
                    }
                }

            `);

            store.validate("Test","Schema1",{ test: 5.3 },(err,res) => {
                expect(err).to.not.be.null;
                expect(res).to.be.null;
            });

        });
        

    });

});