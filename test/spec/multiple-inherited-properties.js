import expect from '../expect';
import { createModelBuilder } from '../helper';
import { Reader, Writer } from '../../lib';
import { assign } from 'min-dash';


describe('Multiple Inherited Properties', function() {

  var createModel = createModelBuilder('test/fixtures/model/');

  var model = createModel([
    'properties',
    'multiple-inherited-properties'
  ]);

  describe('Writer', function() {

    function createWriter(model, options) {
      return new Writer(assign({ preamble: false }, options || {}));
    }

    it('should write properties from multiple namespaces', function() {

      // given
      var writer = createWriter(model);

      var root = model.create('mh:MultipleInherited', {
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

  describe('Reader', function() {

    it('should read properties from multiple namespaces', async function() {

      // given
      var reader = new Reader(model);
      var rootHandler = reader.handler('mh:MultipleInherited');

      var xml =
          '<mh:MultipleInherited ' +
          'xmlns:mh="http://multipleinheritance" ' +
          'xmlns:props="http://properties" ' +
          'props:single="42" single="mh-single" />';

      // when
      var {
        rootElement,
        elementsById,
        warnings,
        references
      } = await reader.fromXML(xml, rootHandler);

      console.log(elementsById);
      var expectedElement = {
        '$type': 'mh:MultipleInherited',
        'props:single': 42,
        single: 'mh-single'
      };

      // then
      expect(elementsById).to.eql({});
      expect(rootElement).to.exist;
      expect(rootElement).to.jsonEqual(expectedElement);
      expect(warnings).to.eql([]);
      expect(references).to.eql([]);
    });
  }); // describe(multiple inherited properties/Reader)
}); // describe(multiple inherited properties)
