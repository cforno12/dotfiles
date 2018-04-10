(function() {
  var change;

  change = require('./helpers/events').change;

  describe('ColorProjectElement', function() {
    var pigments, project, projectElement, ref;
    ref = [], pigments = ref[0], project = ref[1], projectElement = ref[2];
    beforeEach(function() {
      var jasmineContent;
      jasmineContent = document.body.querySelector('#jasmine-content');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          project = pigments.getProject();
          projectElement = atom.views.getView(project);
          return jasmineContent.appendChild(projectElement);
        });
      });
    });
    it('is bound to the ColorProject model', function() {
      return expect(projectElement).toExist();
    });
    describe('typing in the sourceNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSourceNames');
        projectElement.sourceNames.getModel().setText('foo, bar');
        projectElement.sourceNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSourceNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the supportedFiletypes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSupportedFiletypes');
        projectElement.supportedFiletypes.getModel().setText('foo, bar');
        projectElement.supportedFiletypes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSupportedFiletypes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the searchNames input', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setSearchNames');
        projectElement.searchNames.getModel().setText('foo, bar');
        projectElement.searchNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSearchNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredNames');
        projectElement.ignoredNames.getModel().setText('foo, bar');
        projectElement.ignoredNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredScopes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredScopes');
        projectElement.ignoredScopes.getModel().setText('foo, bar');
        projectElement.ignoredScopes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredScopes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('changing the sass implementation', function() {
      return it('update the setting in the project', function() {
        spyOn(project, 'setSassShadeAndTintImplementation');
        projectElement.sassShadeAndTintImplementation.selectedIndex = 1;
        change(projectElement.sassShadeAndTintImplementation);
        return expect(project.setSassShadeAndTintImplementation).toHaveBeenCalledWith('compass');
      });
    });
    describe('toggling on the includeThemes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIncludeThemes');
        projectElement.includeThemes.checked = true;
        change(projectElement.includeThemes);
        expect(project.setIncludeThemes).toHaveBeenCalledWith(true);
        projectElement.includeThemes.checked = false;
        change(projectElement.includeThemes);
        return expect(project.setIncludeThemes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSourceNames checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSourceNames');
        projectElement.ignoreGlobalSourceNames.checked = true;
        change(projectElement.ignoreGlobalSourceNames);
        expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSourceNames.checked = false;
        change(projectElement.ignoreGlobalSourceNames);
        return expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSupportedFiletypes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSupportedFiletypes');
        projectElement.ignoreGlobalSupportedFiletypes.checked = true;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSupportedFiletypes.checked = false;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        return expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredNames checkbox', function() {
      return it('update the ignored names in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredNames');
        projectElement.ignoreGlobalIgnoredNames.checked = true;
        change(projectElement.ignoreGlobalIgnoredNames);
        expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredNames.checked = false;
        change(projectElement.ignoreGlobalIgnoredNames);
        return expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredScopes checkbox', function() {
      return it('update the ignored scopes in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredScopes');
        projectElement.ignoreGlobalIgnoredScopes.checked = true;
        change(projectElement.ignoreGlobalIgnoredScopes);
        expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredScopes.checked = false;
        change(projectElement.ignoreGlobalIgnoredScopes);
        return expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(false);
      });
    });
    return describe('toggling on the ignoreGlobalSearchNames checkbox', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSearchNames');
        projectElement.ignoreGlobalSearchNames.checked = true;
        change(projectElement.ignoreGlobalSearchNames);
        expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSearchNames.checked = false;
        change(projectElement.ignoreGlobalSearchNames);
        return expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL0NyaXNGb3Juby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXByb2plY3QtZWxlbWVudC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsU0FBVSxPQUFBLENBQVEsa0JBQVI7O0VBRVgsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7QUFDOUIsUUFBQTtJQUFBLE1BQXNDLEVBQXRDLEVBQUMsaUJBQUQsRUFBVyxnQkFBWCxFQUFvQjtJQUVwQixVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUI7YUFFakIsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFEO1VBQ2hFLFFBQUEsR0FBVyxHQUFHLENBQUM7VUFDZixPQUFBLEdBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBQTtVQUNWLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE9BQW5CO2lCQUNqQixjQUFjLENBQUMsV0FBZixDQUEyQixjQUEzQjtRQUpnRSxDQUEvQztNQUFILENBQWhCO0lBSFMsQ0FBWDtJQVNBLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBO2FBQ3ZDLE1BQUEsQ0FBTyxjQUFQLENBQXNCLENBQUMsT0FBdkIsQ0FBQTtJQUR1QyxDQUF6QztJQUdBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBO2FBQzFDLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBO1FBQzNDLEtBQUEsQ0FBTSxPQUFOLEVBQWUsZ0JBQWY7UUFFQSxjQUFjLENBQUMsV0FBVyxDQUFDLFFBQTNCLENBQUEsQ0FBcUMsQ0FBQyxPQUF0QyxDQUE4QyxVQUE5QztR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LE1BQUEsQ0FBTyxjQUFjLENBQUMseUJBQXRCO1FBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyw0QkFBZixDQUE0QyxDQUFDLG9CQUE3QyxDQUFrRSxJQUFsRTtRQUVBLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyxPQUF6QyxHQUFtRDtRQUNuRCxNQUFBLENBQU8sY0FBYyxDQUFDLHlCQUF0QjtlQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsNEJBQWYsQ0FBNEMsQ0FBQyxvQkFBN0MsQ0FBa0UsS0FBbEU7TUFYNkMsQ0FBL0M7SUFENkQsQ0FBL0Q7V0FjQSxRQUFBLENBQVMsa0RBQVQsRUFBNkQsU0FBQTthQUMzRCxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQTtRQUMzQyxLQUFBLENBQU0sT0FBTixFQUFlLDRCQUFmO1FBRUEsY0FBYyxDQUFDLHVCQUF1QixDQUFDLE9BQXZDLEdBQWlEO1FBQ2pELE1BQUEsQ0FBTyxjQUFjLENBQUMsdUJBQXRCO1FBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQywwQkFBZixDQUEwQyxDQUFDLG9CQUEzQyxDQUFnRSxJQUFoRTtRQUVBLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxPQUF2QyxHQUFpRDtRQUNqRCxNQUFBLENBQU8sY0FBYyxDQUFDLHVCQUF0QjtlQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsMEJBQWYsQ0FBMEMsQ0FBQyxvQkFBM0MsQ0FBZ0UsS0FBaEU7TUFYMkMsQ0FBN0M7SUFEMkQsQ0FBN0Q7RUEzSThCLENBQWhDO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJ7Y2hhbmdlfSA9IHJlcXVpcmUgJy4vaGVscGVycy9ldmVudHMnXG5cbmRlc2NyaWJlICdDb2xvclByb2plY3RFbGVtZW50JywgLT5cbiAgW3BpZ21lbnRzLCBwcm9qZWN0LCBwcm9qZWN0RWxlbWVudF0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBqYXNtaW5lQ29udGVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2phc21pbmUtY29udGVudCcpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3BpZ21lbnRzJykudGhlbiAocGtnKSAtPlxuICAgICAgcGlnbWVudHMgPSBwa2cubWFpbk1vZHVsZVxuICAgICAgcHJvamVjdCA9IHBpZ21lbnRzLmdldFByb2plY3QoKVxuICAgICAgcHJvamVjdEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcocHJvamVjdClcbiAgICAgIGphc21pbmVDb250ZW50LmFwcGVuZENoaWxkKHByb2plY3RFbGVtZW50KVxuXG4gIGl0ICdpcyBib3VuZCB0byB0aGUgQ29sb3JQcm9qZWN0IG1vZGVsJywgLT5cbiAgICBleHBlY3QocHJvamVjdEVsZW1lbnQpLnRvRXhpc3QoKVxuXG4gIGRlc2NyaWJlICd0eXBpbmcgaW4gdGhlIHNvdXJjZU5hbWVzIGlucHV0JywgLT5cbiAgICBpdCAndXBkYXRlIHRoZSBzb3VyY2UgbmFtZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldFNvdXJjZU5hbWVzJylcblxuICAgICAgcHJvamVjdEVsZW1lbnQuc291cmNlTmFtZXMuZ2V0TW9kZWwoKS5zZXRUZXh0KCdmb28sIGJhcicpXG4gICAgICBwcm9qZWN0RWxlbWVudC5zb3VyY2VOYW1lcy5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpLmVtaXR0ZXIuZW1pdCgnZGlkLXN0b3AtY2hhbmdpbmcnKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRTb3VyY2VOYW1lcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydmb28nLCdiYXInXSlcblxuICBkZXNjcmliZSAndHlwaW5nIGluIHRoZSBzdXBwb3J0ZWRGaWxldHlwZXMgaW5wdXQnLCAtPlxuICAgIGl0ICd1cGRhdGUgdGhlIHNvdXJjZSBuYW1lcyBpbiB0aGUgcHJvamVjdCcsIC0+XG4gICAgICBzcHlPbihwcm9qZWN0LCAnc2V0U3VwcG9ydGVkRmlsZXR5cGVzJylcblxuICAgICAgcHJvamVjdEVsZW1lbnQuc3VwcG9ydGVkRmlsZXR5cGVzLmdldE1vZGVsKCkuc2V0VGV4dCgnZm9vLCBiYXInKVxuICAgICAgcHJvamVjdEVsZW1lbnQuc3VwcG9ydGVkRmlsZXR5cGVzLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCkuZW1pdHRlci5lbWl0KCdkaWQtc3RvcC1jaGFuZ2luZycpXG5cbiAgICAgIGV4cGVjdChwcm9qZWN0LnNldFN1cHBvcnRlZEZpbGV0eXBlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydmb28nLCdiYXInXSlcblxuICBkZXNjcmliZSAndHlwaW5nIGluIHRoZSBzZWFyY2hOYW1lcyBpbnB1dCcsIC0+XG4gICAgaXQgJ3VwZGF0ZSB0aGUgc2VhcmNoIG5hbWVzIGluIHRoZSBwcm9qZWN0JywgLT5cbiAgICAgIHNweU9uKHByb2plY3QsICdzZXRTZWFyY2hOYW1lcycpXG5cbiAgICAgIHByb2plY3RFbGVtZW50LnNlYXJjaE5hbWVzLmdldE1vZGVsKCkuc2V0VGV4dCgnZm9vLCBiYXInKVxuICAgICAgcHJvamVjdEVsZW1lbnQuc2VhcmNoTmFtZXMuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKS5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nJylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0U2VhcmNoTmFtZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnZm9vJywnYmFyJ10pXG5cbiAgZGVzY3JpYmUgJ3R5cGluZyBpbiB0aGUgaWdub3JlZE5hbWVzIGlucHV0JywgLT5cbiAgICBpdCAndXBkYXRlIHRoZSBzb3VyY2UgbmFtZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldElnbm9yZWROYW1lcycpXG5cbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZWROYW1lcy5nZXRNb2RlbCgpLnNldFRleHQoJ2ZvbywgYmFyJylcbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZWROYW1lcy5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpLmVtaXR0ZXIuZW1pdCgnZGlkLXN0b3AtY2hhbmdpbmcnKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJZ25vcmVkTmFtZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnZm9vJywnYmFyJ10pXG5cbiAgZGVzY3JpYmUgJ3R5cGluZyBpbiB0aGUgaWdub3JlZFNjb3BlcyBpbnB1dCcsIC0+XG4gICAgaXQgJ3VwZGF0ZSB0aGUgc291cmNlIG5hbWVzIGluIHRoZSBwcm9qZWN0JywgLT5cbiAgICAgIHNweU9uKHByb2plY3QsICdzZXRJZ25vcmVkU2NvcGVzJylcblxuICAgICAgcHJvamVjdEVsZW1lbnQuaWdub3JlZFNjb3Blcy5nZXRNb2RlbCgpLnNldFRleHQoJ2ZvbywgYmFyJylcbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZWRTY29wZXMuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKS5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nJylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0SWdub3JlZFNjb3BlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydmb28nLCdiYXInXSlcblxuICBkZXNjcmliZSAnY2hhbmdpbmcgdGhlIHNhc3MgaW1wbGVtZW50YXRpb24nLCAtPlxuICAgIGl0ICd1cGRhdGUgdGhlIHNldHRpbmcgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldFNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbicpXG5cbiAgICAgIHByb2plY3RFbGVtZW50LnNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbi5zZWxlY3RlZEluZGV4ID0gMVxuICAgICAgY2hhbmdlKHByb2plY3RFbGVtZW50LnNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbilcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0U2Fzc1NoYWRlQW5kVGludEltcGxlbWVudGF0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY29tcGFzcycpXG5cbiAgZGVzY3JpYmUgJ3RvZ2dsaW5nIG9uIHRoZSBpbmNsdWRlVGhlbWVzIGNoZWNrYm94JywgLT5cbiAgICBpdCAndXBkYXRlIHRoZSBzb3VyY2UgbmFtZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldEluY2x1ZGVUaGVtZXMnKVxuXG4gICAgICBwcm9qZWN0RWxlbWVudC5pbmNsdWRlVGhlbWVzLmNoZWNrZWQgPSB0cnVlXG4gICAgICBjaGFuZ2UocHJvamVjdEVsZW1lbnQuaW5jbHVkZVRoZW1lcylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0SW5jbHVkZVRoZW1lcykudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcblxuICAgICAgcHJvamVjdEVsZW1lbnQuaW5jbHVkZVRoZW1lcy5jaGVja2VkID0gZmFsc2VcbiAgICAgIGNoYW5nZShwcm9qZWN0RWxlbWVudC5pbmNsdWRlVGhlbWVzKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJbmNsdWRlVGhlbWVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcblxuICBkZXNjcmliZSAndG9nZ2xpbmcgb24gdGhlIGlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzIGNoZWNrYm94JywgLT5cbiAgICBpdCAndXBkYXRlIHRoZSBzb3VyY2UgbmFtZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldElnbm9yZUdsb2JhbFNvdXJjZU5hbWVzJylcblxuICAgICAgcHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsU291cmNlTmFtZXMuY2hlY2tlZCA9IHRydWVcbiAgICAgIGNoYW5nZShwcm9qZWN0RWxlbWVudC5pZ25vcmVHbG9iYWxTb3VyY2VOYW1lcylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0SWdub3JlR2xvYmFsU291cmNlTmFtZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG5cbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzLmNoZWNrZWQgPSBmYWxzZVxuICAgICAgY2hhbmdlKHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJZ25vcmVHbG9iYWxTb3VyY2VOYW1lcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG5cbiAgZGVzY3JpYmUgJ3RvZ2dsaW5nIG9uIHRoZSBpZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMgY2hlY2tib3gnLCAtPlxuICAgIGl0ICd1cGRhdGUgdGhlIHNvdXJjZSBuYW1lcyBpbiB0aGUgcHJvamVjdCcsIC0+XG4gICAgICBzcHlPbihwcm9qZWN0LCAnc2V0SWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzJylcblxuICAgICAgcHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzLmNoZWNrZWQgPSB0cnVlXG4gICAgICBjaGFuZ2UocHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG5cbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcy5jaGVja2VkID0gZmFsc2VcbiAgICAgIGNoYW5nZShwcm9qZWN0RWxlbWVudC5pZ25vcmVHbG9iYWxTdXBwb3J0ZWRGaWxldHlwZXMpXG5cbiAgICAgIGV4cGVjdChwcm9qZWN0LnNldElnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG5cbiAgZGVzY3JpYmUgJ3RvZ2dsaW5nIG9uIHRoZSBpZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMgY2hlY2tib3gnLCAtPlxuICAgIGl0ICd1cGRhdGUgdGhlIGlnbm9yZWQgbmFtZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldElnbm9yZUdsb2JhbElnbm9yZWROYW1lcycpXG5cbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbElnbm9yZWROYW1lcy5jaGVja2VkID0gdHJ1ZVxuICAgICAgY2hhbmdlKHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbElnbm9yZWROYW1lcylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0SWdub3JlR2xvYmFsSWdub3JlZE5hbWVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuXG4gICAgICBwcm9qZWN0RWxlbWVudC5pZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMuY2hlY2tlZCA9IGZhbHNlXG4gICAgICBjaGFuZ2UocHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsSWdub3JlZE5hbWVzKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuXG4gIGRlc2NyaWJlICd0b2dnbGluZyBvbiB0aGUgaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcyBjaGVja2JveCcsIC0+XG4gICAgaXQgJ3VwZGF0ZSB0aGUgaWdub3JlZCBzY29wZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldElnbm9yZUdsb2JhbElnbm9yZWRTY29wZXMnKVxuXG4gICAgICBwcm9qZWN0RWxlbWVudC5pZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzLmNoZWNrZWQgPSB0cnVlXG4gICAgICBjaGFuZ2UocHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0SWdub3JlR2xvYmFsSWdub3JlZFNjb3BlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcblxuICAgICAgcHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsSWdub3JlZFNjb3Blcy5jaGVja2VkID0gZmFsc2VcbiAgICAgIGNoYW5nZShwcm9qZWN0RWxlbWVudC5pZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcblxuICBkZXNjcmliZSAndG9nZ2xpbmcgb24gdGhlIGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzIGNoZWNrYm94JywgLT5cbiAgICBpdCAndXBkYXRlIHRoZSBzZWFyY2ggbmFtZXMgaW4gdGhlIHByb2plY3QnLCAtPlxuICAgICAgc3B5T24ocHJvamVjdCwgJ3NldElnbm9yZUdsb2JhbFNlYXJjaE5hbWVzJylcblxuICAgICAgcHJvamVjdEVsZW1lbnQuaWdub3JlR2xvYmFsU2VhcmNoTmFtZXMuY2hlY2tlZCA9IHRydWVcbiAgICAgIGNoYW5nZShwcm9qZWN0RWxlbWVudC5pZ25vcmVHbG9iYWxTZWFyY2hOYW1lcylcblxuICAgICAgZXhwZWN0KHByb2plY3Quc2V0SWdub3JlR2xvYmFsU2VhcmNoTmFtZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG5cbiAgICAgIHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzLmNoZWNrZWQgPSBmYWxzZVxuICAgICAgY2hhbmdlKHByb2plY3RFbGVtZW50Lmlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzKVxuXG4gICAgICBleHBlY3QocHJvamVjdC5zZXRJZ25vcmVHbG9iYWxTZWFyY2hOYW1lcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4iXX0=
