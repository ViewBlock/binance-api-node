'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.candleFields = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash = require('lodash.zipobject');

var _lodash2 = _interopRequireDefault(_lodash);

require('isomorphic-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE = 'https://api.binance.com';

/**
 * Build query string for uri encoded url based on json object
 */
var makeQueryString = function makeQueryString(q) {
  return q ? '?' + Object.keys(q).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]);
  }).join('&') : '';
};

/**
 * Finalize API response
 */
var sendResult = function sendResult(call) {
  return call.then(function (res) {
    return Promise.all([res, res.json()]);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        res = _ref2[0],
        json = _ref2[1];

    if (!res.ok) {
      var error = new Error(json.msg || res.status + ' ' + res.statusText);
      error.code = json.code;
      throw error;
    }

    return json;
  });
};

/**
 * Util to validate existence of required parameter(s)
 */
var checkParams = function checkParams(name, payload) {
  var requires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!payload) {
    throw new Error('You need to pass a payload object.');
  }

  requires.forEach(function (r) {
    if (!payload[r] && isNaN(payload[r])) {
      throw new Error('Method ' + name + ' requires ' + r + ' parameter.');
    }
  });

  return true;
};

/**
 * Make public calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
var publicCall = function publicCall(path, data) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return sendResult(fetch(BASE + '/api' + path + makeQueryString(data), {
    method: method,
    json: true,
    headers: headers
  }));
};

/**
 * Factory method for partial private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @returns {object} The api response
 */
var keyCall = function keyCall(_ref3) {
  var apiKey = _ref3.apiKey;
  return function (path, data) {
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

    if (!apiKey) {
      throw new Error('You need to pass an API key to make this call.');
    }

    return publicCall(path, data, method, {
      'X-MBX-APIKEY': apiKey
    });
  };
};

/**
 * Factory method for private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
var privateCall = function privateCall(_ref4) {
  var apiKey = _ref4.apiKey,
      apiSecret = _ref4.apiSecret;
  return function (path) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var noData = arguments[3];
    var noExtra = arguments[4];

    if (!apiKey || !apiSecret) {
      throw new Error('You need to pass an API key and secret to make authenticated calls.');
    }

    return (data && data.useServerTime ? publicCall('/v1/time').then(function (r) {
      return r.serverTime;
    }) : Promise.resolve(Date.now())).then(function (timestamp) {
      if (data) {
        delete data.useServerTime;
      }

      var signature = _crypto2.default.createHmac('sha256', apiSecret).update(makeQueryString(_extends({}, data, { timestamp: timestamp })).substr(1)).digest('hex');

      var newData = noExtra ? data : _extends({}, data, { timestamp: timestamp, signature: signature });

      return sendResult(fetch('' + BASE + (path.includes('/wapi') ? '' : '/api') + path + (noData ? '' : makeQueryString(newData)), {
        method: method,
        headers: { 'X-MBX-APIKEY': apiKey },
        json: true
      }));
    });
  };
};

var candleFields = exports.candleFields = ['openTime', 'open', 'high', 'low', 'close', 'volume', 'closeTime', 'quoteVolume', 'trades', 'baseAssetVolume', 'quoteAssetVolume'];

/**
 * Get candles for a specific pair and interval and convert response
 * to a user friendly collection.
 */
var candles = function candles(payload) {
  return checkParams('candles', payload, ['symbol']) && publicCall('/v1/klines', _extends({ interval: '5m' }, payload)).then(function (candles) {
    return candles.map(function (candle) {
      return (0, _lodash2.default)(candleFields, candle);
    });
  });
};

/**
 * Create a new order wrapper for market order simplicity
 */
var _order = function _order(pCall) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var url = arguments[2];

  var newPayload = ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(payload.type) || !payload.type ? _extends({ timeInForce: 'GTC' }, payload) : payload;

  return checkParams('order', newPayload, ['symbol', 'side', 'quantity']) && pCall(url, _extends({ type: 'LIMIT' }, newPayload), 'POST');
};

/**
 * Zip asks and bids reponse from order book
 */
var book = function book(payload) {
  return checkParams('book', payload, ['symbol']) && publicCall('/v1/depth', payload).then(function (_ref5) {
    var lastUpdateId = _ref5.lastUpdateId,
        asks = _ref5.asks,
        bids = _ref5.bids;
    return {
      lastUpdateId: lastUpdateId,
      asks: asks.map(function (a) {
        return (0, _lodash2.default)(['price', 'quantity'], a);
      }),
      bids: bids.map(function (b) {
        return (0, _lodash2.default)(['price', 'quantity'], b);
      })
    };
  });
};

var aggTrades = function aggTrades(payload) {
  return checkParams('aggTrades', payload, ['symbol']) && publicCall('/v1/aggTrades', payload).then(function (trades) {
    return trades.map(function (trade) {
      return {
        aggId: trade.a,
        price: trade.p,
        quantity: trade.q,
        firstId: trade.f,
        lastId: trade.l,
        timestamp: trade.T,
        isBuyerMaker: trade.m,
        wasBestPrice: trade.M
      };
    });
  });
};

exports.default = function (opts) {
  var pCall = privateCall(opts);
  var kCall = keyCall(opts);

  return {
    ping: function ping() {
      return publicCall('/v1/ping').then(function () {
        return true;
      });
    },
    time: function time() {
      return publicCall('/v1/time').then(function (r) {
        return r.serverTime;
      });
    },
    exchangeInfo: function exchangeInfo() {
      return publicCall('/v1/exchangeInfo');
    },

    book: book,
    aggTrades: aggTrades,
    candles: candles,

    trades: function trades(payload) {
      return checkParams('trades', payload, ['symbol']) && publicCall('/v1/trades', payload);
    },
    tradesHistory: function tradesHistory(payload) {
      return checkParams('tradesHitory', payload, ['symbol']) && kCall('/v1/historicalTrades', payload);
    },

    dailyStats: function dailyStats(payload) {
      return publicCall('/v1/ticker/24hr', payload);
    },
    prices: function prices() {
      return publicCall('/v1/ticker/allPrices').then(function (r) {
        return r.reduce(function (out, cur) {
          return out[cur.symbol] = cur.price, out;
        }, {});
      });
    },

    avgPrice: function avgPrice(payload) {
      return publicCall('/v3/avgPrice', payload);
    },

    allBookTickers: function allBookTickers() {
      return publicCall('/v1/ticker/allBookTickers').then(function (r) {
        return r.reduce(function (out, cur) {
          return out[cur.symbol] = cur, out;
        }, {});
      });
    },

    order: function order(payload) {
      return _order(pCall, payload, '/v3/order');
    },
    orderTest: function orderTest(payload) {
      return _order(pCall, payload, '/v3/order/test');
    },
    getOrder: function getOrder(payload) {
      return pCall('/v3/order', payload);
    },
    cancelOrder: function cancelOrder(payload) {
      return pCall('/v3/order', payload, 'DELETE');
    },

    openOrders: function openOrders(payload) {
      return pCall('/v3/openOrders', payload);
    },
    allOrders: function allOrders(payload) {
      return pCall('/v3/allOrders', payload);
    },

    accountInfo: function accountInfo(payload) {
      return pCall('/v3/account', payload);
    },
    myTrades: function myTrades(payload) {
      return pCall('/v3/myTrades', payload);
    },

    withdraw: function withdraw(payload) {
      return pCall('/wapi/v3/withdraw.html', payload, 'POST');
    },
    withdrawHistory: function withdrawHistory(payload) {
      return pCall('/wapi/v3/withdrawHistory.html', payload);
    },
    depositHistory: function depositHistory(payload) {
      return pCall('/wapi/v3/depositHistory.html', payload);
    },
    depositAddress: function depositAddress(payload) {
      return pCall('/wapi/v3/depositAddress.html', payload);
    },
    tradeFee: function tradeFee(payload) {
      return pCall('/wapi/v3/tradeFee.html', payload);
    },
    assetDetail: function assetDetail(payload) {
      return pCall('/wapi/v3/assetDetail.html', payload);
    },

    getDataStream: function getDataStream() {
      return pCall('/v1/userDataStream', null, 'POST', true);
    },
    keepDataStream: function keepDataStream(payload) {
      return pCall('/v1/userDataStream', payload, 'PUT', false, true);
    },
    closeDataStream: function closeDataStream(payload) {
      return pCall('/v1/userDataStream', payload, 'DELETE', false, true);
    }
  };
};