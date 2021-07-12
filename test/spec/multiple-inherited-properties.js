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

    describe('Attributes', function() {

      it('should write simple typed attributes', function() {

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
            '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                  'xmlns:props="http://properties" ' +
                                  'props:id="Root_1" ' +
                                  'props:single="42" ' +
                                  'single="mi-single" />';

        // then
        expect(xml).to.eql(expectedXml);
      });
    }); // describe(multiple inherited properties/Writer/Attributes)

    describe('Containments', function() {

      it('should write simple typed containments', function() {

        // given
        var writer = createWriter(model);

        var root = model.create('mi:MultipleInherited', {
          'nonAttrSingle': 'mi-nonAttrSingle',
          'props:nonAttrSingle': 42
        });

        // when
        var xml = writer.toXML(root);

        var expectedXml =
            '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                  'xmlns:props="http://properties">' +
              '<props:nonAttrSingle>42</props:nonAttrSingle>' +
              '<mi:nonAttrSingle>mi-nonAttrSingle</mi:nonAttrSingle>' +
            '</mi:MultipleInherited>';

        // then
        expect(xml).to.eql(expectedXml);
      });

      describe('complex types', function() {
        it('should write complex typed containments for other ns', function() {

          // given
          var writer = createWriter(model);

          var containedRoot = model.create('mi:MultipleInherited', {
            'props:single': 42
          });

          var root = model.create('mi:MultipleInherited', {
            'props:root': containedRoot
          });

          // when
          var xml = writer.toXML(root);

          var expectedXml =
              '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                    'xmlns:props="http://properties">' +
                '<props:root props:single="42" />' +
              '</mi:MultipleInherited>';

          // then
          expect(xml).to.eql(expectedXml);
        });

        it('should write complex typed containments for local ns', function() {

          // given
          var writer = createWriter(model);

          var containedRoot = model.create('mi:MultipleInherited', {
            single: 'mi-single'
          });

          var root = model.create('mi:MultipleInherited', {
            root: containedRoot
          });

          // when
          var xml = writer.toXML(root);

          var expectedXml =
              '<mi:MultipleInherited xmlns:mi="http://multipleinheritance">' +
                '<mi:root single="mi-single" />' +
              '</mi:MultipleInherited>';

          // then
          expect(xml).to.eql(expectedXml);
        });

        it('should write complex typed containments for all ns', function() {

          // given
          var writer = createWriter(model);

          var localContainedRoot = model.create('mi:MultipleInherited', {
            single: 'mi-single'
          });

          var otherContainedRoot = model.create('props:Root', {
            'single': 42
          });

          var root = model.create('mi:MultipleInherited', {
            root: localContainedRoot,
            'props:root': otherContainedRoot
          });

          // when
          var xml = writer.toXML(root);

          var expectedXml =
              '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                    'xmlns:props="http://properties">' +
                '<props:root single="42" />' +
                '<mi:root single="mi-single" />' +
              '</mi:MultipleInherited>';

          // then
          expect(xml).to.eql(expectedXml);
        });
      }); // describe(multiple inherited properties/Writer/Containments/complex types)
    }); // describe(multiple inherited properties/Writer/Containments)

    describe('Collections', function() {

      it('should write simple typed collections', function() {

        // given
        var writer = createWriter(model);
        var root = model.create('mi:MultipleInherited');

        root.get('many').push('mi-many');
        root.get('props:many').push(23);

        // when
        var xml = writer.toXML(root);

        var expectedXml =
            '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                  'xmlns:props="http://properties">' +
              '<props:many>23</props:many>' +
              '<mi:many>mi-many</mi:many>' +
            '</mi:MultipleInherited>';

        // then
        expect(xml).to.eql(expectedXml);
      });
    }); // describe(multiple inherited properties/Writer/Collections)
  }); // describe(multiple inherited properties/Writer)

  describe('Reader', function() {

    // given
    var reader = new Reader(model);

    describe('Attributes', function() {

      it('should read simple typed attributes', async function() {

        // given
        var rootHandler = reader.handler('mi:MultipleInherited');
        var xml =
            '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
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
    }); // describe(multiple inherited properties/Reader/Attributes)

    describe('Containments', function() {

      it('should read simple typed containments', async function() {

        // given
        var rootHandler = reader.handler('mi:MultipleInherited');
        var xml =
            '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                  'xmlns:props="http://properties">' +
              '<props:nonAttrSingle>42</props:nonAttrSingle>' +
              '<mi:nonAttrSingle>mi-nonAttrSingle</mi:nonAttrSingle>' +
            '</mi:MultipleInherited>';

        // when
        var {
          rootElement,
          elementsById,
          warnings,
          references
        } = await reader.fromXML(xml, rootHandler);

        var expectedElement = model.create('mi:MultipleInherited', {
          'props:nonAttrSingle': 42,
          'nonAttrSingle': 'mi-nonAttrSingle'
        });

        // then
        expect(elementsById).to.eql({});
        expect(rootElement).to.exist;
        expect(rootElement).to.jsonEqual(expectedElement);
        expect(warnings).to.eql([]);
        expect(references).to.eql([]);
      });
    }); // describe(multiple inherited properties/Reader/Containments)

    describe('Collections', function() {

      it('should read simple typed collections', async function() {

        // given
        var rootHandler = reader.handler('mi:MultipleInherited');
        var xml =
            '<mi:MultipleInherited xmlns:mi="http://multipleinheritance" ' +
                                  'xmlns:props="http://properties">' +
            '  <props:many>23</props:many>' +
            '  <mi:many>mi-many</mi:many>' +
            '</mi:MultipleInherited>';

        // when
        var {
          rootElement,
          elementsById,
          warnings,
          references
        } = await reader.fromXML(xml, rootHandler);

        var expectedElement = {
          '$type': 'mi:MultipleInherited',
          'props:many': [ 23 ],
          many: [ 'mi-many' ]
        };

        // then
        expect(elementsById).to.eql({});
        expect(rootElement).to.exist;
        expect(rootElement).to.jsonEqual(expectedElement);
        expect(warnings).to.eql([]);
        expect(references).to.eql([]);
      });
    }); // describe(multiple inherited properties/Reader/Collections)
  }); // describe(multiple inherited properties/Reader)
}); // describe(multiple inherited properties)
