import sureJs from '../../src/sure-js';

describe('sureJs', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(sureJs, 'greet');
      sureJs.greet();
    });

    it('should have been run once', () => {
      expect(sureJs.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(sureJs.greet).to.have.always.returned('hello');
    });
  });
});
