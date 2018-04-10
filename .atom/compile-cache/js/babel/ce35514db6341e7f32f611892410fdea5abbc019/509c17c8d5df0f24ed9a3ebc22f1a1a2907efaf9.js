function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tinycolor2 = require('tinycolor2');

var _tinycolor22 = _interopRequireDefault(_tinycolor2);

var _helperWriteConfigFile = require('../helper/write-config-file');

var _helperWriteConfigFile2 = _interopRequireDefault(_helperWriteConfigFile);

var _helperToggleClassName = require('../helper/toggle-class-name');

var _helperToggleClassName2 = _interopRequireDefault(_helperToggleClassName);

var _helperToCamelCase = require('../helper/to-camel-case');

var _helperToCamelCase2 = _interopRequireDefault(_helperToCamelCase);

var _colorTemplatesJson = require('../color-templates.json');

var _colorTemplatesJson2 = _interopRequireDefault(_colorTemplatesJson);

var _buildColorSettings = require('./build-color-settings');

var _buildColorSettings2 = _interopRequireDefault(_buildColorSettings);

'use babel';

atom.config.onDidChange('atom-material-ui.colors.abaseColor', function (_ref) {
    var newValue = _ref.newValue;

    var baseColor = typeof color === 'object' ? (0, _tinycolor22['default'])(newValue.toHexString()) : (0, _tinycolor22['default'])(newValue);

    if (atom.config.get('atom-material-ui.colors.genAccent')) {
        var accentColor = baseColor.complement().saturate(20).lighten(5);
        return atom.config.set('atom-material-ui.colors.accentColor', accentColor.toRgbString());
    }

    return (0, _helperWriteConfigFile2['default'])((0, _buildColorSettings2['default'])(newValue, atom.config.get('atom-material-ui.colors.accentColor')), true);
});

atom.config.onDidChange('atom-material-ui.colors.predefinedColor', function (value) {
    var newValue = (0, _helperToCamelCase2['default'])(value.newValue);

    atom.config.set('atom-material-ui.colors.abaseColor', _colorTemplatesJson2['default'][newValue].base);
    atom.config.set('atom-material-ui.colors.accentColor', _colorTemplatesJson2['default'][newValue].accent);
});

atom.config.onDidChange('atom-material-ui.colors.accentColor', function (_ref2) {
    var newValue = _ref2.newValue;
    return (0, _helperWriteConfigFile2['default'])((0, _buildColorSettings2['default'])(atom.config.get('atom-material-ui.colors.abaseColor'), newValue), true);
});

atom.config.observe('atom-material-ui.colors.paintCursor', function (value) {
    return (0, _helperToggleClassName2['default'])('amu-paint-cursor', value);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvY29sb3JzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzBCQUVzQixZQUFZOzs7O3FDQUNOLDZCQUE2Qjs7OztxQ0FDN0IsNkJBQTZCOzs7O2lDQUNqQyx5QkFBeUI7Ozs7a0NBQ3RCLHlCQUF5Qjs7OztrQ0FDckIsd0JBQXdCOzs7O0FBUHZELFdBQVcsQ0FBQzs7QUFTWixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQ0FBb0MsRUFBRSxVQUFDLElBQVksRUFBSztRQUFmLFFBQVEsR0FBVixJQUFZLENBQVYsUUFBUTs7QUFDckUsUUFBTSxTQUFTLEdBQUcsQUFBQyxPQUFPLEtBQUssS0FBSyxRQUFRLEdBQUksNkJBQVUsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsNkJBQVUsUUFBUSxDQUFDLENBQUM7O0FBRXhHLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsRUFBRTtBQUN0RCxZQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0tBQzVGOztBQUVELFdBQU8sd0NBQ0gscUNBQ0ksUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQ25FLEVBQ0QsSUFBSSxDQUNQLENBQUM7Q0FDTCxDQUFDLENBQUM7O0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMseUNBQXlDLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDMUUsUUFBTSxRQUFRLEdBQUcsb0NBQVksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU3QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsRUFBRSxnQ0FBZSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxnQ0FBZSxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUMzRixDQUFDLENBQUM7O0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMscUNBQXFDLEVBQUUsVUFBQyxLQUFZO1FBQVYsUUFBUSxHQUFWLEtBQVksQ0FBVixRQUFRO1dBQ3RFLHdDQUNJLHFDQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEVBQUUsUUFBUSxDQUNsRSxFQUNELElBQUksQ0FDUDtDQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsRUFBRSxVQUFBLEtBQUs7V0FBSSx3Q0FBZ0Isa0JBQWtCLEVBQUUsS0FBSyxDQUFDO0NBQUEsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9DcmlzRm9ybm8vZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvY29sb3JzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB0aW55Y29sb3IgZnJvbSAndGlueWNvbG9yMic7XG5pbXBvcnQgd3JpdGVDb25maWdGaWxlIGZyb20gJy4uL2hlbHBlci93cml0ZS1jb25maWctZmlsZSc7XG5pbXBvcnQgdG9nZ2xlQ2xhc3NOYW1lIGZyb20gJy4uL2hlbHBlci90b2dnbGUtY2xhc3MtbmFtZSc7XG5pbXBvcnQgdG9DYW1lbENhc2UgZnJvbSAnLi4vaGVscGVyL3RvLWNhbWVsLWNhc2UnO1xuaW1wb3J0IGNvbG9yVGVtcGxhdGVzIGZyb20gJy4uL2NvbG9yLXRlbXBsYXRlcy5qc29uJztcbmltcG9ydCBidWlsZENvbG9yU2V0dGluZ3MgZnJvbSAnLi9idWlsZC1jb2xvci1zZXR0aW5ncyc7XG5cbmF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJywgKHsgbmV3VmFsdWUgfSkgPT4ge1xuICAgIGNvbnN0IGJhc2VDb2xvciA9ICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSA/IHRpbnljb2xvcihuZXdWYWx1ZS50b0hleFN0cmluZygpKSA6IHRpbnljb2xvcihuZXdWYWx1ZSk7XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5nZW5BY2NlbnQnKSkge1xuICAgICAgICBjb25zdCBhY2NlbnRDb2xvciA9IGJhc2VDb2xvci5jb21wbGVtZW50KCkuc2F0dXJhdGUoMjApLmxpZ2h0ZW4oNSk7XG4gICAgICAgIHJldHVybiBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFjY2VudENvbG9yJywgYWNjZW50Q29sb3IudG9SZ2JTdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyaXRlQ29uZmlnRmlsZShcbiAgICAgICAgYnVpbGRDb2xvclNldHRpbmdzKFxuICAgICAgICAgICAgbmV3VmFsdWUsIGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWNjZW50Q29sb3InKSxcbiAgICAgICAgKSxcbiAgICAgICAgdHJ1ZSxcbiAgICApO1xufSk7XG5cbmF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5wcmVkZWZpbmVkQ29sb3InLCAodmFsdWUpID0+IHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRvQ2FtZWxDYXNlKHZhbHVlLm5ld1ZhbHVlKTtcblxuICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS5jb2xvcnMuYWJhc2VDb2xvcicsIGNvbG9yVGVtcGxhdGVzW25ld1ZhbHVlXS5iYXNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFjY2VudENvbG9yJywgY29sb3JUZW1wbGF0ZXNbbmV3VmFsdWVdLmFjY2VudCk7XG59KTtcblxuYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tbWF0ZXJpYWwtdWkuY29sb3JzLmFjY2VudENvbG9yJywgKHsgbmV3VmFsdWUgfSkgPT4gKFxuICAgIHdyaXRlQ29uZmlnRmlsZShcbiAgICAgICAgYnVpbGRDb2xvclNldHRpbmdzKFxuICAgICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5hYmFzZUNvbG9yJyksIG5ld1ZhbHVlLFxuICAgICAgICApLFxuICAgICAgICB0cnVlLFxuICAgIClcbikpO1xuXG5hdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5wYWludEN1cnNvcicsIHZhbHVlID0+IHRvZ2dsZUNsYXNzTmFtZSgnYW11LXBhaW50LWN1cnNvcicsIHZhbHVlKSk7XG4iXX0=