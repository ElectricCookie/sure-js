import SureJS from '../../src/sure-js';

describe('sureJs', () => {

   

    describe('#addSchemas', () => {


        it("should add Schemas to the Store",() => {

            let store = new SureJS();

            store.addSchemas(__dirname+"/*.sjs",() => {
                expect(store.getNamespaces()).to.deep.equal(["User"])
            });   

        });

     

    });

    describe("#validate", () => {


        it("should validate an object",() => {

            let store = new SureJS();

            store.addSchemas(__dirname+"/*.sjs",() => {
                let test = {
                    username: "ElectricCookie",
                    lastSeen: 0,
                    bio: "",
                    registered: 0
                };

                store.validate("User","PublicProfile",test,(err,result) => {
                    expect(err).to.be.null
                    expect(result).to.deep.equal(test);
                });
            });   


            

        });
        

        it("should validate a nested Schema",() => {

            let store = new SureJS();

            store.parseSchema(`


                Test{

                    #Schema1{
                        foo: boolean()
                    }

                    #Schema2{
                        bar: @Schema1
                    }

                }

            `)


            let test = {
                bar: {
                    foo: true
                }
            }

            store.validate("Test","Schema2",test,(err,res) => {


                expect(err).to.be.null;
                expect(res).to.deep.equal(test);

            })

        });


        it("should validate an array Schema",() => {

            let store = new SureJS();

            store.parseSchema(`


                Test{

                    #Schema1{
                        foo: boolean[]()
                    }

                    #Schema2{
                        bar: @Schema1
                    }

                }

            `)


            let test = {
                bar: {
                    foo: [true,false]
                }
            }

            store.validate("Test","Schema2",test,(err,res) => {


                expect(err).to.be.null;
                expect(res).to.deep.equal(test);

            })

        });

    });




});
