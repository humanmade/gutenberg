/**
 * External dependencies
 */
import { parse, stringify } from './ast';
import traverse from 'traverse';

function traverseCSS(css, callback) {
  try {
    var parsed = parse(css);
    var updated = traverse.map(parsed, function (node) {
      if (!node) {
        return node;
      }

      var updatedNode = callback(node);
      return this.update(updatedNode);
    });
    return stringify(updated);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Error while traversing the CSS: ' + err);
    return null;
  }
}

export default traverseCSS;
//# sourceMappingURL=traverse.js.map