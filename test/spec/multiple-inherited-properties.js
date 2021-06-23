import expect from '../expect';
import { createModelBuilder } from '../helper';
import { Writer } from '../../lib';
import { assign } from 'min-dash';


describe('Multiple Inherited Properties', function() {

  var createModel = createModelBuilder('test/fixtures/model/');

  describe('Writer', function() {

    function createWriter(model, options) {
      return new Writer(assign({ preamble: false }, options || {}));
    }

    var mhModel = createModel([
      'properties',
      'multiple-inherited-properties'
    ]);

    it('should write properties from multiple namespaces', function() {

      // given
      var writer = createWriter(mhModel);

      var root = mhModel.create('mh:MultipleInherited', {
        'id': 'Root_1',
        'single': 'mh-single',
        'props:single': 42
      });

      // when
      var xml = writer.toXML(root);

      var expectedXml =
          '<mh:MultipleInherited xmlns:mh="http://multipleinheritance"' +
          ' xmlns:props="http://properties" props:id="Root_1"' +
          ' props:single="42"' +
          ' single="mh-single" />';

      // then
      expect(xml).to.eql(expectedXml);
    });

  }); // describe(multiple inherited properties/Writer)

}); // describe(multiple inherited properties)
