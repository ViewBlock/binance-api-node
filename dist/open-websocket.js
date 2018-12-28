'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _html5Websocket = require('html5-websocket');

var _html5Websocket2 = _interopRequireDefault(_html5Websocket);

var _reconnectingWebsocket = require('reconnecting-websocket');

var _reconnectingWebsocket2 = _interopRequireDefault(_reconnectingWebsocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (url) {
  return new _reconnectingWebsocket2.default(url, undefined, {
    connectionTimeout: 4E3,
    constructor: typeof window !== 'undefined' ? WebSocket : _html5Websocket2.default,
    debug: false,
    maxReconnectionDelay: 10E3,
    maxRetries: Infinity,
    minReconnectionDelay: 4E3
  });
};