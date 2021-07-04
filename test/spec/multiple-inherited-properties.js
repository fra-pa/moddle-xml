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

      var root = model.create('mi:MultipleInherited', {
        'id': 'Root_1',
        'single': 'mi-single',
        'props:single': 42
      });

      // when
      var xml = writer.toXML(root);

      var expectedXml =
          '<mi:MultipleInherited xmlns:mi="http://multipleinheritance"' +
          ' xmlns:props="http://properties" props:id="Root_1"' +
          ' props:single="42"' +
          ' single="mi-single" />';

      // then
      expect(xml).to.eql(expectedXml);
    });

    it('should write non-attribute property as child element', function() {

      // given
      var writer = createWriter(model);

      var root = model.create('mi:MultipleInherited', {
        'nonAttrSingle': 'mi-nonAttrSingle',
        'props:nonAttrSingle': 42
      });

      // when
      var xml = writer.toXML(root);

      var expectedXml =
          '<mi:MultipleInherited xmlns:mi="http://multipleinheritance"' +
          ' xmlns:props="http://properties">' +
          '<props:nonAttrSingle>42</props:nonAttrSingle>' +
          '<mi:nonAttrSingle>mi-nonAttrSingle</mi:nonAttrSingle>' +
          '</mi:MultipleInherited>';

      // then
      expect(xml).to.eql(expectedXml);
    });
  }); // describe(multiple inherited properties/Writer)

  describe('Reader', function() {

    it('should read properties from multiple namespaces', async function() {

      // given
      var reader = new Reader(model);
      var rootHandler = reader.handler('mi:MultipleInherited');

      var xml =
          '<mi:MultipleInherited ' +
          'xmlns:mi="http://multipleinheritance" ' +
          'xmlns:props="http://properties" ' +
          'props:single="42" single="mi-single" />';

      // when
      var {
        rootElement,
        elementsById,
        warnings,
        references
      } = await reader.fromXML(xml, rootHandler);

      var expectedElement = {
        '$type': 'mi:MultipleInherited',
        'props:single': 42,
        single: 'mi-single'
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
