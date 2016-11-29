import SureJS from '../../src/sure-js';

describe('sureJs', () => {
  describe('#addSchemas', () => {
      

    it("should add Schemas to the Store",() => {

      let store = new SureJS();

      expect(() => {
        store.addSchemas(__dirname+"/*.sjs",() => {
          console.log("Namespaces");
          console.log(store.getNamespaces());
        });    
      }).to.not.throw(Error);

    })

    
    
    

    


  });
});
