function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _libProvidersHighlight = require('../lib/providers-highlight');

var _libProvidersHighlight2 = _interopRequireDefault(_libProvidersHighlight);

describe('ProvidersHighlight', function () {
  var providersHighlight = undefined;
  var editor = undefined;

  beforeEach(function () {
    if (providersHighlight) {
      providersHighlight.dispose();
    }
    providersHighlight = new _libProvidersHighlight2['default']();
    atom.workspace.destroyActivePane();
    waitsForPromise(function () {
      return atom.workspace.open(__filename).then(function () {
        editor = atom.workspace.getActiveTextEditor();
      });
    });
    atom.packages.activatePackage('language-javascript');
  });
  function addProvider(provider) {
    return providersHighlight.addProvider(provider);
  }
  function deleteProvider(provider) {
    providersHighlight.deleteProvider(provider);
  }

  describe('addProvider', function () {
    it('validates parameters properly', function () {
      expect(function () {
        addProvider();
      }).toThrow();
      expect(function () {
        addProvider(null);
      }).toThrow();
      expect(function () {
        addProvider(1);
      }).toThrow();
      expect(function () {
        addProvider(false);
      }).toThrow();
      expect(function () {
        addProvider(true);
      }).toThrow();

      expect(function () {
        addProvider({
          grammarScopes: false
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: null
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: true
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: 5
        });
      }).toThrow();

      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: false
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: null
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: true
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: 20
        });
      }).toThrow();
      addProvider({
        grammarScopes: [],
        getIntentions: function getIntentions() {}
      });
    });
  });
  describe('hasProvider', function () {
    it('works properly', function () {
      var provider = {
        grammarScopes: [],
        getIntentions: function getIntentions() {
          throw new Error();
        }
      };
      expect(providersHighlight.hasProvider(provider)).toBe(false);
      providersHighlight.addProvider(provider);
      expect(providersHighlight.hasProvider(provider)).toBe(true);
    });
  });
  describe('deleteProvider', function () {
    it('works properly', function () {
      deleteProvider(true);
      deleteProvider(null);
      deleteProvider(false);
      deleteProvider(50);
      var provider = {
        grammarScopes: [],
        getIntentions: function getIntentions() {
          throw new Error();
        }
      };
      expect(providersHighlight.hasProvider(provider)).toBe(false);
      providersHighlight.addProvider(provider);
      expect(providersHighlight.hasProvider(provider)).toBe(true);
      providersHighlight.deleteProvider(provider);
      expect(providersHighlight.hasProvider(provider)).toBe(false);
    });
  });
  describe('trigger', function () {
    it('works properly', function () {
      var intention = {
        range: [[0, 1], [1, Infinity]],
        'class': 'something',
        created: function created() {}
      };
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return [intention];
        }
      });
      waitsForPromise(function () {
        return providersHighlight.trigger(editor).then(function (results) {
          (0, _assert2['default'])(Array.isArray(results));
          expect(results[0]).toBe(intention);
        });
      });
    });
    it('ignores previous result from executed twice instantly', function () {
      var count = 0;
      var intentionFirst = {
        range: [[0, 1], [1, Infinity]],
        'class': 'something',
        created: function created() {}
      };
      var intentionSecond = {
        range: [[0, 1], [1, Infinity]],
        created: function created() {}
      };
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          if (++count === 1) {
            return [intentionFirst];
          }
          return [intentionSecond];
        }
      });
      var promiseFirst = providersHighlight.trigger(editor);
      var promiseSecond = providersHighlight.trigger(editor);

      waitsForPromise(function () {
        return promiseFirst.then(function (results) {
          expect(results).toEqual([]);
        });
      });
      waitsForPromise(function () {
        return promiseSecond.then(function (results) {
          (0, _assert2['default'])(Array.isArray(results));
          expect(results[0]).toBe(intentionSecond);
        });
      });
    });
    it('does not enable it if providers return no results, including non-array ones', function () {
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return [];
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return null;
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return false;
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return 50;
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {}
      });
      waitsForPromise(function () {
        return providersHighlight.trigger(editor).then(function (results) {
          expect(results).toEqual([]);
        });
      });
    });
    it('emits an error if provider throws an error', function () {
      providersHighlight.addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          throw new Error('test from provider');
        }
      });
      waitsForPromise(function () {
        return providersHighlight.trigger(editor).then(function () {
          expect(false).toBe(true);
        }, function (e) {
          expect(e.message).toBe('test from provider');
        });
      });
    });
    it('validates suggestions properly', function () {
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return [{}];
        }
      });
      waitsForPromise(function () {
        return providersHighlight.trigger(editor).then(function () {
          expect(false).toBe(true);
        }, function (e) {
          expect(e instanceof Error).toBe(true);
        });
      });
    });
    it('triggers providers based on scope', function () {
      var coffeeCalled = false;
      var jsCalled = false;
      addProvider({
        grammarScopes: ['source.js'],
        getIntentions: function getIntentions() {
          jsCalled = true;
        }
      });
      addProvider({
        grammarScopes: ['source.coffee'],
        getIntentions: function getIntentions() {
          coffeeCalled = true;
        }
      });
      waitsForPromise(function () {
        return providersHighlight.trigger(editor).then(function () {
          expect(jsCalled).toBe(true);
          expect(coffeeCalled).toBe(false);
        });
      });
    });
  });

  it('automatically updates length of decoration everytime coordinates update', function () {
    var element = undefined;
    var jsCalled = false;
    var range = [[2, 0], [2, 5]];
    addProvider({
      grammarScopes: ['source.js'],
      getIntentions: function getIntentions() {
        jsCalled = true;
        return [{
          range: range,
          created: function created(_ref) {
            var _element = _ref.element;

            element = _element;
          }
        }];
      }
    });
    waitsForPromise(function () {
      return providersHighlight.trigger(editor).then(function (intentions) {
        (0, _assert2['default'])(Array.isArray(intentions));
        expect(jsCalled).toBe(true);
        expect(element).not.toBeDefined();
        providersHighlight.paint(editor, intentions);
        expect(element).toBeDefined();
        expect(element.textContent.length).toBe(5);
        editor.setTextInBufferRange(range, 'something');
        expect(element.textContent.length).toBe(9);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9zcGVjL3Byb3ZpZGVycy1oaWdobGlnaHQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztzQkFFc0IsUUFBUTs7OztxQ0FDQyw0QkFBNEI7Ozs7QUFFM0QsUUFBUSxDQUFDLG9CQUFvQixFQUFFLFlBQVc7QUFDeEMsTUFBSSxrQkFBa0IsWUFBQSxDQUFBO0FBQ3RCLE1BQUksTUFBTSxZQUFBLENBQUE7O0FBRVYsWUFBVSxDQUFDLFlBQVc7QUFDcEIsUUFBSSxrQkFBa0IsRUFBRTtBQUN0Qix3QkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3QjtBQUNELHNCQUFrQixHQUFHLHdDQUF3QixDQUFBO0FBQzdDLFFBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtBQUNsQyxtQkFBZSxDQUFDLFlBQVc7QUFDekIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUNyRCxjQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO09BQzlDLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUE7R0FDckQsQ0FBQyxDQUFBO0FBQ0YsV0FBUyxXQUFXLENBQUMsUUFBYSxFQUFFO0FBQ2xDLFdBQU8sa0JBQWtCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQ2hEO0FBQ0QsV0FBUyxjQUFjLENBQUMsUUFBYSxFQUFFO0FBQ3JDLHNCQUFrQixDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUM1Qzs7QUFFRCxVQUFRLENBQUMsYUFBYSxFQUFFLFlBQVc7QUFDakMsTUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQVc7QUFDN0MsWUFBTSxDQUFDLFlBQVc7QUFDaEIsbUJBQVcsRUFBRSxDQUFBO09BQ2QsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ1osWUFBTSxDQUFDLFlBQVc7QUFDaEIsbUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUNsQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ2YsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ1osWUFBTSxDQUFDLFlBQVc7QUFDaEIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUNuQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ2xCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDO0FBQ1YsdUJBQWEsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNaLFlBQU0sQ0FBQyxZQUFXO0FBQ2hCLG1CQUFXLENBQUM7QUFDVix1QkFBYSxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ1osWUFBTSxDQUFDLFlBQVc7QUFDaEIsbUJBQVcsQ0FBQztBQUNWLHVCQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDO0FBQ1YsdUJBQWEsRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDO0FBQ1YsdUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHVCQUFhLEVBQUUsS0FBSztTQUNyQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDO0FBQ1YsdUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHVCQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDO0FBQ1YsdUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHVCQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixZQUFNLENBQUMsWUFBVztBQUNoQixtQkFBVyxDQUFDO0FBQ1YsdUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHVCQUFhLEVBQUUsRUFBRTtTQUNsQixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDWixpQkFBVyxDQUFDO0FBQ1YscUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHFCQUFhLEVBQUEseUJBQUcsRUFBRTtPQUNuQixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7QUFDRixVQUFRLENBQUMsYUFBYSxFQUFFLFlBQVc7QUFDakMsTUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQVc7QUFDOUIsVUFBTSxRQUFRLEdBQUc7QUFDZixxQkFBYSxFQUFFLEVBQUU7QUFDakIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGdCQUFNLElBQUksS0FBSyxFQUFFLENBQUE7U0FDbEI7T0FDRixDQUFBO0FBQ0QsWUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1RCx3QkFBa0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDeEMsWUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM1RCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7QUFDRixVQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBVztBQUNwQyxNQUFFLENBQUMsZ0JBQWdCLEVBQUUsWUFBVztBQUM5QixvQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BCLG9CQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEIsb0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNyQixvQkFBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2xCLFVBQU0sUUFBUSxHQUFHO0FBQ2YscUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHFCQUFhLEVBQUEseUJBQUc7QUFDZCxnQkFBTSxJQUFJLEtBQUssRUFBRSxDQUFBO1NBQ2xCO09BQ0YsQ0FBQTtBQUNELFlBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUQsd0JBQWtCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFlBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0Qsd0JBQWtCLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNDLFlBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDN0QsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0FBQ0YsVUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFXO0FBQzdCLE1BQUUsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFXO0FBQzlCLFVBQU0sU0FBUyxHQUFHO0FBQ2hCLGFBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlCLGlCQUFPLFdBQVc7QUFDbEIsZUFBTyxFQUFBLG1CQUFHLEVBQUU7T0FDYixDQUFBO0FBQ0QsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGlCQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDbkI7T0FDRixDQUFDLENBQUE7QUFDRixxQkFBZSxDQUFDLFlBQVc7QUFDekIsZUFBTyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsT0FBTyxFQUFFO0FBQy9ELG1DQUFVLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUNqQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUNuQyxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7QUFDRixNQUFFLENBQUMsdURBQXVELEVBQUUsWUFBVztBQUNyRSxVQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDYixVQUFNLGNBQWMsR0FBRztBQUNyQixhQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5QixpQkFBTyxXQUFXO0FBQ2xCLGVBQU8sRUFBQSxtQkFBRyxFQUFFO09BQ2IsQ0FBQTtBQUNELFVBQU0sZUFBZSxHQUFHO0FBQ3RCLGFBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlCLGVBQU8sRUFBQSxtQkFBRyxFQUFFO09BQ2IsQ0FBQTtBQUNELGlCQUFXLENBQUM7QUFDVixxQkFBYSxFQUFFLENBQUMsR0FBRyxDQUFDO0FBQ3BCLHFCQUFhLEVBQUEseUJBQUc7QUFDZCxjQUFJLEVBQUUsS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNqQixtQkFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1dBQ3hCO0FBQ0QsaUJBQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtTQUN6QjtPQUNGLENBQUMsQ0FBQTtBQUNGLFVBQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN2RCxVQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRXhELHFCQUFlLENBQUMsWUFBVztBQUN6QixlQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBUyxPQUFPLEVBQUU7QUFDekMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDNUIsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0FBQ0YscUJBQWUsQ0FBQyxZQUFXO0FBQ3pCLGVBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUMxQyxtQ0FBVSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDakMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7U0FDekMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0FBQ0YsTUFBRSxDQUFDLDZFQUE2RSxFQUFFLFlBQVc7QUFDM0YsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGlCQUFPLEVBQUUsQ0FBQTtTQUNWO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGlCQUFPLElBQUksQ0FBQTtTQUNaO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGlCQUFPLEtBQUssQ0FBQTtTQUNiO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGlCQUFPLEVBQUUsQ0FBQTtTQUNWO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRyxFQUVmO09BQ0YsQ0FBQyxDQUFBO0FBQ0YscUJBQWUsQ0FBQyxZQUFXO0FBQ3pCLGVBQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUMvRCxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUM1QixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7QUFDRixNQUFFLENBQUMsNENBQTRDLEVBQUUsWUFBVztBQUMxRCx3QkFBa0IsQ0FBQyxXQUFXLENBQUM7QUFDN0IscUJBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQztBQUNwQixxQkFBYSxFQUFBLHlCQUFHO0FBQ2QsZ0JBQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtTQUN0QztPQUNGLENBQUMsQ0FBQTtBQUNGLHFCQUFlLENBQUMsWUFBVztBQUN6QixlQUFPLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUN4RCxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN6QixFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7U0FDN0MsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0FBQ0YsTUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQVc7QUFDOUMsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDcEIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGlCQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDWjtPQUNGLENBQUMsQ0FBQTtBQUNGLHFCQUFlLENBQUMsWUFBVztBQUN6QixlQUFPLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUN4RCxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN6QixFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU0sQ0FBQyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3RDLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtBQUNGLE1BQUUsQ0FBQyxtQ0FBbUMsRUFBRSxZQUFXO0FBQ2pELFVBQUksWUFBWSxHQUFHLEtBQUssQ0FBQTtBQUN4QixVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDcEIsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDNUIscUJBQWEsRUFBQSx5QkFBRztBQUNkLGtCQUFRLEdBQUcsSUFBSSxDQUFBO1NBQ2hCO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQztBQUNWLHFCQUFhLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDaEMscUJBQWEsRUFBQSx5QkFBRztBQUNkLHNCQUFZLEdBQUcsSUFBSSxDQUFBO1NBQ3BCO09BQ0YsQ0FBQyxDQUFBO0FBQ0YscUJBQWUsQ0FBQyxZQUFXO0FBQ3pCLGVBQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQ3hELGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzNCLGdCQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ2pDLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMseUVBQXlFLEVBQUUsWUFBVztBQUN2RixRQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsUUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFFBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixlQUFXLENBQUM7QUFDVixtQkFBYSxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQzVCLG1CQUFhLEVBQUEseUJBQUc7QUFDZCxnQkFBUSxHQUFHLElBQUksQ0FBQTtBQUNmLGVBQU8sQ0FBQztBQUNOLGVBQUssRUFBTCxLQUFLO0FBQ0wsaUJBQU8sRUFBQSxpQkFBQyxJQUFxQixFQUFFO2dCQUFaLFFBQVEsR0FBbkIsSUFBcUIsQ0FBbkIsT0FBTzs7QUFDZixtQkFBTyxHQUFHLFFBQVEsQ0FBQTtXQUNuQjtTQUNGLENBQUMsQ0FBQTtPQUNIO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsbUJBQWUsQ0FBQyxZQUFXO0FBQ3pCLGFBQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLFVBQVUsRUFBRTtBQUNsRSxpQ0FBVSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFDcEMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMzQixjQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pDLDBCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDNUMsY0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQzdCLGNBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMxQyxjQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQy9DLGNBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMzQyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvcHJvdmlkZXJzLWhpZ2hsaWdodC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGludmFyaWFudCBmcm9tICdhc3NlcnQnXG5pbXBvcnQgUHJvdmlkZXJzSGlnaGxpZ2h0IGZyb20gJy4uL2xpYi9wcm92aWRlcnMtaGlnaGxpZ2h0J1xuXG5kZXNjcmliZSgnUHJvdmlkZXJzSGlnaGxpZ2h0JywgZnVuY3Rpb24oKSB7XG4gIGxldCBwcm92aWRlcnNIaWdobGlnaHRcbiAgbGV0IGVkaXRvclxuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgaWYgKHByb3ZpZGVyc0hpZ2hsaWdodCkge1xuICAgICAgcHJvdmlkZXJzSGlnaGxpZ2h0LmRpc3Bvc2UoKVxuICAgIH1cbiAgICBwcm92aWRlcnNIaWdobGlnaHQgPSBuZXcgUHJvdmlkZXJzSGlnaGxpZ2h0KClcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19maWxlbmFtZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB9KVxuICAgIH0pXG4gICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuICB9KVxuICBmdW5jdGlvbiBhZGRQcm92aWRlcihwcm92aWRlcjogYW55KSB7XG4gICAgcmV0dXJuIHByb3ZpZGVyc0hpZ2hsaWdodC5hZGRQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBmdW5jdGlvbiBkZWxldGVQcm92aWRlcihwcm92aWRlcjogYW55KSB7XG4gICAgcHJvdmlkZXJzSGlnaGxpZ2h0LmRlbGV0ZVByb3ZpZGVyKHByb3ZpZGVyKVxuICB9XG5cbiAgZGVzY3JpYmUoJ2FkZFByb3ZpZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3ZhbGlkYXRlcyBwYXJhbWV0ZXJzIHByb3Blcmx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFByb3ZpZGVyKClcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcihudWxsKVxuICAgICAgfSkudG9UaHJvdygpXG4gICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFByb3ZpZGVyKDEpXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoZmFsc2UpXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIodHJ1ZSlcbiAgICAgIH0pLnRvVGhyb3coKVxuXG4gICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgICBncmFtbWFyU2NvcGVzOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogbnVsbCxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogNSxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuXG4gICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgICBncmFtbWFyU2NvcGVzOiBbXSxcbiAgICAgICAgICBnZXRJbnRlbnRpb25zOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICAgICAgZ2V0SW50ZW50aW9uczogbnVsbCxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICAgICAgZ2V0SW50ZW50aW9uczogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICAgICAgZ2V0SW50ZW50aW9uczogMjAsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7fSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJ2hhc1Byb3ZpZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3dvcmtzIHByb3Blcmx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKClcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGV4cGVjdChwcm92aWRlcnNIaWdobGlnaHQuaGFzUHJvdmlkZXIocHJvdmlkZXIpKS50b0JlKGZhbHNlKVxuICAgICAgcHJvdmlkZXJzSGlnaGxpZ2h0LmFkZFByb3ZpZGVyKHByb3ZpZGVyKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyc0hpZ2hsaWdodC5oYXNQcm92aWRlcihwcm92aWRlcikpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgnZGVsZXRlUHJvdmlkZXInLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnd29ya3MgcHJvcGVybHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGRlbGV0ZVByb3ZpZGVyKHRydWUpXG4gICAgICBkZWxldGVQcm92aWRlcihudWxsKVxuICAgICAgZGVsZXRlUHJvdmlkZXIoZmFsc2UpXG4gICAgICBkZWxldGVQcm92aWRlcig1MClcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgZXhwZWN0KHByb3ZpZGVyc0hpZ2hsaWdodC5oYXNQcm92aWRlcihwcm92aWRlcikpLnRvQmUoZmFsc2UpXG4gICAgICBwcm92aWRlcnNIaWdobGlnaHQuYWRkUHJvdmlkZXIocHJvdmlkZXIpXG4gICAgICBleHBlY3QocHJvdmlkZXJzSGlnaGxpZ2h0Lmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkudG9CZSh0cnVlKVxuICAgICAgcHJvdmlkZXJzSGlnaGxpZ2h0LmRlbGV0ZVByb3ZpZGVyKHByb3ZpZGVyKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyc0hpZ2hsaWdodC5oYXNQcm92aWRlcihwcm92aWRlcikpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJ3RyaWdnZXInLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnd29ya3MgcHJvcGVybHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGludGVudGlvbiA9IHtcbiAgICAgICAgcmFuZ2U6IFtbMCwgMV0sIFsxLCBJbmZpbml0eV1dLFxuICAgICAgICBjbGFzczogJ3NvbWV0aGluZycsXG4gICAgICAgIGNyZWF0ZWQoKSB7fSxcbiAgICAgIH1cbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgcmV0dXJuIFtpbnRlbnRpb25dXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvdmlkZXJzSGlnaGxpZ2h0LnRyaWdnZXIoZWRpdG9yKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShyZXN1bHRzKSlcbiAgICAgICAgICBleHBlY3QocmVzdWx0c1swXSkudG9CZShpbnRlbnRpb24pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gICAgaXQoJ2lnbm9yZXMgcHJldmlvdXMgcmVzdWx0IGZyb20gZXhlY3V0ZWQgdHdpY2UgaW5zdGFudGx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY291bnQgPSAwXG4gICAgICBjb25zdCBpbnRlbnRpb25GaXJzdCA9IHtcbiAgICAgICAgcmFuZ2U6IFtbMCwgMV0sIFsxLCBJbmZpbml0eV1dLFxuICAgICAgICBjbGFzczogJ3NvbWV0aGluZycsXG4gICAgICAgIGNyZWF0ZWQoKSB7fSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGludGVudGlvblNlY29uZCA9IHtcbiAgICAgICAgcmFuZ2U6IFtbMCwgMV0sIFsxLCBJbmZpbml0eV1dLFxuICAgICAgICBjcmVhdGVkKCkge30sXG4gICAgICB9XG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIGlmICgrK2NvdW50ID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gW2ludGVudGlvbkZpcnN0XVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW2ludGVudGlvblNlY29uZF1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9taXNlRmlyc3QgPSBwcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcihlZGl0b3IpXG4gICAgICBjb25zdCBwcm9taXNlU2Vjb25kID0gcHJvdmlkZXJzSGlnaGxpZ2h0LnRyaWdnZXIoZWRpdG9yKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlRmlyc3QudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgZXhwZWN0KHJlc3VsdHMpLnRvRXF1YWwoW10pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVNlY29uZC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShyZXN1bHRzKSlcbiAgICAgICAgICBleHBlY3QocmVzdWx0c1swXSkudG9CZShpbnRlbnRpb25TZWNvbmQpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGVuYWJsZSBpdCBpZiBwcm92aWRlcnMgcmV0dXJuIG5vIHJlc3VsdHMsIGluY2x1ZGluZyBub24tYXJyYXkgb25lcycsIGZ1bmN0aW9uKCkge1xuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJyonXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJyonXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHJldHVybiA1MFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG5cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcihlZGl0b3IpLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgIGV4cGVjdChyZXN1bHRzKS50b0VxdWFsKFtdKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICAgIGl0KCdlbWl0cyBhbiBlcnJvciBpZiBwcm92aWRlciB0aHJvd3MgYW4gZXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIHByb3ZpZGVyc0hpZ2hsaWdodC5hZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGVzdCBmcm9tIHByb3ZpZGVyJylcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcihlZGl0b3IpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBleHBlY3QoZS5tZXNzYWdlKS50b0JlKCd0ZXN0IGZyb20gcHJvdmlkZXInKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICAgIGl0KCd2YWxpZGF0ZXMgc3VnZ2VzdGlvbnMgcHJvcGVybHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgcmV0dXJuIFt7fV1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcihlZGl0b3IpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBleHBlY3QoZSBpbnN0YW5jZW9mIEVycm9yKS50b0JlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gICAgaXQoJ3RyaWdnZXJzIHByb3ZpZGVycyBiYXNlZCBvbiBzY29wZScsIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGNvZmZlZUNhbGxlZCA9IGZhbHNlXG4gICAgICBsZXQganNDYWxsZWQgPSBmYWxzZVxuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qcyddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIGpzQ2FsbGVkID0gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuY29mZmVlJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgY29mZmVlQ2FsbGVkID0gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyc0hpZ2hsaWdodC50cmlnZ2VyKGVkaXRvcikudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBleHBlY3QoanNDYWxsZWQpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBleHBlY3QoY29mZmVlQ2FsbGVkKS50b0JlKGZhbHNlKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdhdXRvbWF0aWNhbGx5IHVwZGF0ZXMgbGVuZ3RoIG9mIGRlY29yYXRpb24gZXZlcnl0aW1lIGNvb3JkaW5hdGVzIHVwZGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBlbGVtZW50XG4gICAgbGV0IGpzQ2FsbGVkID0gZmFsc2VcbiAgICBjb25zdCByYW5nZSA9IFtbMiwgMF0sIFsyLCA1XV1cbiAgICBhZGRQcm92aWRlcih7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qcyddLFxuICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAganNDYWxsZWQgPSB0cnVlXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgIGNyZWF0ZWQoeyBlbGVtZW50OiBfZWxlbWVudCB9KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gX2VsZW1lbnRcbiAgICAgICAgICB9LFxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICB9KVxuICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcihlZGl0b3IpLnRoZW4oZnVuY3Rpb24oaW50ZW50aW9ucykge1xuICAgICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShpbnRlbnRpb25zKSlcbiAgICAgICAgZXhwZWN0KGpzQ2FsbGVkKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChlbGVtZW50KS5ub3QudG9CZURlZmluZWQoKVxuICAgICAgICBwcm92aWRlcnNIaWdobGlnaHQucGFpbnQoZWRpdG9yLCBpbnRlbnRpb25zKVxuICAgICAgICBleHBlY3QoZWxlbWVudCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoZWxlbWVudC50ZXh0Q29udGVudC5sZW5ndGgpLnRvQmUoNSlcbiAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCAnc29tZXRoaW5nJylcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQudGV4dENvbnRlbnQubGVuZ3RoKS50b0JlKDkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19