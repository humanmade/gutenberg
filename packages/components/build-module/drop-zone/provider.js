import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import "core-js/modules/web.dom.iterable";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";

/**
 * External dependencies
 */
import { isEqual, find, some, filter, noop, throttle } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, findDOMNode } from '@wordpress/element';
import isShallowEqual from '@wordpress/is-shallow-equal';

var DropZoneProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(DropZoneProvider, _Component);

  function DropZoneProvider() {
    var _this;

    _classCallCheck(this, DropZoneProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropZoneProvider).apply(this, arguments));
    _this.resetDragState = _this.resetDragState.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.toggleDraggingOverDocument = throttle(_this.toggleDraggingOverDocument.bind(_assertThisInitialized(_assertThisInitialized(_this))), 200);
    _this.dragOverListener = _this.dragOverListener.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.isWithinZoneBounds = _this.isWithinZoneBounds.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onDrop = _this.onDrop.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      isDraggingOverDocument: false,
      hoveredDropZone: -1,
      position: null
    };
    _this.dropzones = [];
    return _this;
  }

  _createClass(DropZoneProvider, [{
    key: "dragOverListener",
    value: function dragOverListener(event) {
      this.toggleDraggingOverDocument(event, this.getDragEventType(event));
      event.preventDefault();
    }
  }, {
    key: "getChildContext",
    value: function getChildContext() {
      var _this2 = this;

      return {
        dropzones: {
          add: function add(_ref) {
            var element = _ref.element,
                updateState = _ref.updateState,
                onDrop = _ref.onDrop,
                onFilesDrop = _ref.onFilesDrop,
                onHTMLDrop = _ref.onHTMLDrop;

            _this2.dropzones.push({
              element: element,
              updateState: updateState,
              onDrop: onDrop,
              onFilesDrop: onFilesDrop,
              onHTMLDrop: onHTMLDrop
            });
          },
          remove: function remove(element) {
            _this2.dropzones = filter(_this2.dropzones, function (dropzone) {
              return dropzone.element !== element;
            });
          }
        }
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('dragover', this.dragOverListener);
      window.addEventListener('drop', this.onDrop);
      window.addEventListener('mouseup', this.resetDragState); // Disable reason: Can't use a ref since this component just renders its children
      // eslint-disable-next-line react/no-find-dom-node

      this.container = findDOMNode(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('dragover', this.dragOverListener);
      window.removeEventListener('drop', this.onDrop);
      window.removeEventListener('mouseup', this.resetDragState);
    }
  }, {
    key: "resetDragState",
    value: function resetDragState() {
      // Avoid throttled drag over handler calls
      this.toggleDraggingOverDocument.cancel();
      var _this$state = this.state,
          isDraggingOverDocument = _this$state.isDraggingOverDocument,
          hoveredDropZone = _this$state.hoveredDropZone;

      if (!isDraggingOverDocument && hoveredDropZone === -1) {
        return;
      }

      this.setState({
        isDraggingOverDocument: false,
        hoveredDropZone: -1,
        position: null
      });
      this.dropzones.forEach(function (_ref2) {
        var updateState = _ref2.updateState;
        updateState({
          isDraggingOverDocument: false,
          isDraggingOverElement: false,
          position: null,
          type: null
        });
      });
    }
  }, {
    key: "getDragEventType",
    value: function getDragEventType(event) {
      if (event.dataTransfer) {
        if (event.dataTransfer.types.indexOf('Files') !== -1) {
          return 'file';
        }

        if (event.dataTransfer.types.indexOf('text/html') !== -1) {
          return 'html';
        }
      }

      return 'default';
    }
  }, {
    key: "doesDropzoneSupportType",
    value: function doesDropzoneSupportType(dropzone, type) {
      return type === 'file' && dropzone.onFilesDrop || type === 'html' && dropzone.onHTMLDrop || type === 'default' && dropzone.onDrop;
    }
  }, {
    key: "toggleDraggingOverDocument",
    value: function toggleDraggingOverDocument(event, dragEventType) {
      var _this3 = this;

      // In some contexts, it may be necessary to capture and redirect the
      // drag event (e.g. atop an `iframe`). To accommodate this, you can
      // create an instance of CustomEvent with the original event specified
      // as the `detail` property.
      //
      // See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
      var detail = window.CustomEvent && event instanceof window.CustomEvent ? event.detail : event; // Index of hovered dropzone.

      var hoveredDropZones = filter(this.dropzones, function (dropzone) {
        return _this3.doesDropzoneSupportType(dropzone, dragEventType) && _this3.isWithinZoneBounds(dropzone.element, detail.clientX, detail.clientY);
      }); // Find the leaf dropzone not containing another dropzone

      var hoveredDropZone = find(hoveredDropZones, function (zone) {
        return !some(hoveredDropZones, function (subZone) {
          return subZone !== zone && zone.element.parentElement.contains(subZone.element);
        });
      });
      var hoveredDropZoneIndex = this.dropzones.indexOf(hoveredDropZone);
      var position = null;

      if (hoveredDropZone) {
        var rect = hoveredDropZone.element.getBoundingClientRect();
        position = {
          x: detail.clientX - rect.left < rect.right - detail.clientX ? 'left' : 'right',
          y: detail.clientY - rect.top < rect.bottom - detail.clientY ? 'top' : 'bottom'
        };
      } // Optimisation: Only update the changed dropzones


      var dropzonesToUpdate = [];

      if (!this.state.isDraggingOverDocument) {
        dropzonesToUpdate = this.dropzones;
      } else if (hoveredDropZoneIndex !== this.state.hoveredDropZone) {
        if (this.state.hoveredDropZone !== -1) {
          dropzonesToUpdate.push(this.dropzones[this.state.hoveredDropZone]);
        }

        if (hoveredDropZone) {
          dropzonesToUpdate.push(hoveredDropZone);
        }
      } else if (hoveredDropZone && hoveredDropZoneIndex === this.state.hoveredDropZone && !isEqual(position, this.state.position)) {
        dropzonesToUpdate.push(hoveredDropZone);
      } // Notifying the dropzones


      dropzonesToUpdate.map(function (dropzone) {
        var index = _this3.dropzones.indexOf(dropzone);

        var isDraggingOverDropZone = index === hoveredDropZoneIndex;
        dropzone.updateState({
          isDraggingOverElement: isDraggingOverDropZone,
          position: isDraggingOverDropZone ? position : null,
          isDraggingOverDocument: _this3.doesDropzoneSupportType(dropzone, dragEventType),
          type: isDraggingOverDropZone ? dragEventType : null
        });
      });
      var newState = {
        isDraggingOverDocument: true,
        hoveredDropZone: hoveredDropZoneIndex,
        position: position
      };

      if (!isShallowEqual(newState, this.state)) {
        this.setState(newState);
      }
    }
  }, {
    key: "isWithinZoneBounds",
    value: function isWithinZoneBounds(dropzone, x, y) {
      var isWithinElement = function isWithinElement(element) {
        var rect = element.getBoundingClientRect(); /// make sure the rect is a valid rect

        if (rect.bottom === rect.top || rect.left === rect.right) {
          return false;
        }

        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      };

      return isWithinElement(dropzone);
    }
  }, {
    key: "onDrop",
    value: function onDrop(event) {
      // This seemingly useless line has been shown to resolve a Safari issue
      // where files dragged directly from the dock are not recognized
      event.dataTransfer && event.dataTransfer.files.length; // eslint-disable-line no-unused-expressions

      var _this$state2 = this.state,
          position = _this$state2.position,
          hoveredDropZone = _this$state2.hoveredDropZone;
      var dragEventType = this.getDragEventType(event);
      var dropzone = this.dropzones[hoveredDropZone];
      var isValidDropzone = !!dropzone && this.container.contains(event.target);
      this.resetDragState();

      if (isValidDropzone) {
        switch (dragEventType) {
          case 'file':
            dropzone.onFilesDrop(_toConsumableArray(event.dataTransfer.files), position);
            break;

          case 'html':
            dropzone.onHTMLDrop(event.dataTransfer.getData('text/html'), position);
            break;

          case 'default':
            dropzone.onDrop(event, position);
        }
      }

      event.stopPropagation();
      event.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);

  return DropZoneProvider;
}(Component);

DropZoneProvider.childContextTypes = {
  dropzones: noop
};
export default DropZoneProvider;