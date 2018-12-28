'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keepStreamAlive = exports.userEventHandler = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.zipobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _openWebsocket = require('./open-websocket');

var _openWebsocket2 = _interopRequireDefault(_openWebsocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var BASE = 'wss://stream.binance.com:9443/ws';

var depth = function depth(payload, cb) {
  var cache = (Array.isArray(payload) ? payload : [payload]).map(function (symbol) {
    var w = (0, _openWebsocket2.default)(BASE + '/' + symbol.toLowerCase() + '@depth');
    w.onmessage = function (msg) {
      var _JSON$parse = JSON.parse(msg.data),
          eventType = _JSON$parse.e,
          eventTime = _JSON$parse.E,
          symbol = _JSON$parse.s,
          firstUpdateId = _JSON$parse.U,
          finalUpdateId = _JSON$parse.u,
          bidDepth = _JSON$parse.b,
          askDepth = _JSON$parse.a;

      cb({
        eventType: eventType,
        eventTime: eventTime,
        symbol: symbol,
        firstUpdateId: firstUpdateId,
        finalUpdateId: finalUpdateId,
        bidDepth: bidDepth.map(function (b) {
          return (0, _lodash2.default)(['price', 'quantity'], b);
        }),
        askDepth: askDepth.map(function (a) {
          return (0, _lodash2.default)(['price', 'quantity'], a);
        })
      });
    };

    return w;
  });

  return function (options) {
    return cache.forEach(function (w) {
      return w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
    });
  };
};

var partialDepth = function partialDepth(payload, cb) {
  var cache = (Array.isArray(payload) ? payload : [payload]).map(function (_ref) {
    var symbol = _ref.symbol,
        level = _ref.level;

    var w = (0, _openWebsocket2.default)(BASE + '/' + symbol.toLowerCase() + '@depth' + level);
    w.onmessage = function (msg) {
      var _JSON$parse2 = JSON.parse(msg.data),
          lastUpdateId = _JSON$parse2.lastUpdateId,
          bids = _JSON$parse2.bids,
          asks = _JSON$parse2.asks;

      cb({
        symbol: symbol,
        level: level,
        lastUpdateId: lastUpdateId,
        bids: bids.map(function (b) {
          return (0, _lodash2.default)(['price', 'quantity'], b);
        }),
        asks: asks.map(function (a) {
          return (0, _lodash2.default)(['price', 'quantity'], a);
        })
      });
    };

    return w;
  });

  return function (options) {
    return cache.forEach(function (w) {
      return w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
    });
  };
};

var candles = function candles(payload, interval, cb) {
  if (!interval || !cb) {
    throw new Error('Please pass a symbol, interval and callback.');
  }

  var cache = (Array.isArray(payload) ? payload : [payload]).map(function (symbol) {
    var w = (0, _openWebsocket2.default)(BASE + '/' + symbol.toLowerCase() + '@kline_' + interval);
    w.onmessage = function (msg) {
      var _JSON$parse3 = JSON.parse(msg.data),
          eventType = _JSON$parse3.e,
          eventTime = _JSON$parse3.E,
          symbol = _JSON$parse3.s,
          tick = _JSON$parse3.k;

      var startTime = tick.t,
          closeTime = tick.T,
          firstTradeId = tick.f,
          lastTradeId = tick.L,
          open = tick.o,
          high = tick.h,
          low = tick.l,
          close = tick.c,
          volume = tick.v,
          trades = tick.n,
          interval = tick.i,
          isFinal = tick.x,
          quoteVolume = tick.q,
          buyVolume = tick.V,
          quoteBuyVolume = tick.Q;


      cb({
        eventType: eventType,
        eventTime: eventTime,
        symbol: symbol,
        startTime: startTime,
        closeTime: closeTime,
        firstTradeId: firstTradeId,
        lastTradeId: lastTradeId,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume,
        trades: trades,
        interval: interval,
        isFinal: isFinal,
        quoteVolume: quoteVolume,
        buyVolume: buyVolume,
        quoteBuyVolume: quoteBuyVolume
      });
    };

    return w;
  });

  return function (options) {
    return cache.forEach(function (w) {
      return w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
    });
  };
};

var tickerTransform = function tickerTransform(m) {
  return {
    eventType: m.e,
    eventTime: m.E,
    symbol: m.s,
    priceChange: m.p,
    priceChangePercent: m.P,
    weightedAvg: m.w,
    prevDayClose: m.x,
    curDayClose: m.c,
    closeTradeQuantity: m.Q,
    bestBid: m.b,
    bestBidQnt: m.B,
    bestAsk: m.a,
    bestAskQnt: m.A,
    open: m.o,
    high: m.h,
    low: m.l,
    volume: m.v,
    volumeQuote: m.q,
    openTime: m.O,
    closeTime: m.C,
    firstTradeId: m.F,
    lastTradeId: m.L,
    totalTrades: m.n
  };
};

var ticker = function ticker(payload, cb) {
  var cache = (Array.isArray(payload) ? payload : [payload]).map(function (symbol) {
    var w = (0, _openWebsocket2.default)(BASE + '/' + symbol.toLowerCase() + '@ticker');

    w.onmessage = function (msg) {
      cb(tickerTransform(JSON.parse(msg.data)));
    };

    return w;
  });

  return function (options) {
    return cache.forEach(function (w) {
      return w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
    });
  };
};

var allTickers = function allTickers(cb) {
  var w = new _openWebsocket2.default(BASE + '/!ticker@arr');

  w.onmessage = function (msg) {
    var arr = JSON.parse(msg.data);
    cb(arr.map(function (m) {
      return tickerTransform(m);
    }));
  };

  return function (options) {
    return w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
  };
};

var tradesInternal = function tradesInternal(payload, streamName, cb) {
  var cache = (Array.isArray(payload) ? payload : [payload]).map(function (symbol) {
    var w = (0, _openWebsocket2.default)(BASE + '/' + symbol.toLowerCase() + '@' + streamName);
    w.onmessage = function (msg) {
      var _JSON$parse4 = JSON.parse(msg.data),
          eventType = _JSON$parse4.e,
          eventTime = _JSON$parse4.E,
          symbol = _JSON$parse4.s,
          price = _JSON$parse4.p,
          quantity = _JSON$parse4.q,
          maker = _JSON$parse4.m,
          isBuyerMaker = _JSON$parse4.M,
          tradeId = _JSON$parse4.a;

      cb({
        eventType: eventType,
        eventTime: eventTime,
        symbol: symbol,
        price: price,
        quantity: quantity,
        maker: maker,
        isBuyerMaker: isBuyerMaker,
        tradeId: tradeId
      });
    };

    return w;
  });

  return function (options) {
    return cache.forEach(function (w) {
      return w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
    });
  };
};

var aggTrades = function aggTrades(payload, cb) {
  return tradesInternal(payload, 'aggTrade', cb);
};

var trades = function trades(payload, cb) {
  return tradesInternal(payload, 'trade', cb);
};

var userTransforms = {
  outboundAccountInfo: function outboundAccountInfo(m) {
    return {
      eventType: 'account',
      eventTime: m.E,
      makerCommissionRate: m.m,
      takerCommissionRate: m.t,
      buyerCommissionRate: m.b,
      sellerCommissionRate: m.s,
      canTrade: m.T,
      canWithdraw: m.W,
      canDeposit: m.D,
      lastAccountUpdate: m.u,
      balances: m.B.reduce(function (out, cur) {
        out[cur.a] = { available: cur.f, locked: cur.l };
        return out;
      }, {})
    };
  },
  executionReport: function executionReport(m) {
    return {
      eventType: 'executionReport',
      eventTime: m.E,
      symbol: m.s,
      newClientOrderId: m.c,
      originalClientOrderId: m.C,
      side: m.S,
      orderType: m.o,
      timeInForce: m.f,
      quantity: m.q,
      price: m.p,
      executionType: m.x,
      stopPrice: m.P,
      icebergQuantity: m.F,
      orderStatus: m.X,
      orderRejectReason: m.r,
      orderId: m.i,
      orderTime: m.T,
      lastTradeQuantity: m.l,
      totalTradeQuantity: m.z,
      priceLastTrade: m.L,
      commission: m.n,
      commissionAsset: m.N,
      tradeId: m.t,
      isOrderWorking: m.w,
      isBuyerMaker: m.m,
      creationTime: m.O,
      totalQuoteTradeQuantity: m.Z
    };
  }
};

var userEventHandler = function userEventHandler(cb) {
  return function (msg) {
    var _JSON$parse5 = JSON.parse(msg.data),
        type = _JSON$parse5.e,
        rest = _objectWithoutProperties(_JSON$parse5, ['e']);

    cb(userTransforms[type] ? userTransforms[type](rest) : _extends({ type: type }, rest));
  };
};

exports.userEventHandler = userEventHandler;
var keepStreamAlive = exports.keepStreamAlive = function keepStreamAlive(method, listenKey) {
  return method({ listenKey: listenKey }).catch(function (f) {
    return f;
  });
};

var user = function user(opts) {
  return function (cb) {
    var _httpMethods = (0, _http2.default)(opts),
        getDataStream = _httpMethods.getDataStream,
        keepDataStream = _httpMethods.keepDataStream,
        closeDataStream = _httpMethods.closeDataStream;

    return getDataStream().then(function (_ref2) {
      var listenKey = _ref2.listenKey;

      var w = (0, _openWebsocket2.default)(BASE + '/' + listenKey);
      w.onmessage = function (msg) {
        return userEventHandler(cb)(msg);
      };

      var int = setInterval(function () {
        keepStreamAlive(keepDataStream, listenKey);
      }, 50e3);

      keepStreamAlive(keepDataStream, listenKey);

      return function (options) {
        clearInterval(int);
        closeDataStream({ listenKey: listenKey }).catch(function (f) {
          return f;
        });
        w.close(1000, 'Close handle was called', _extends({ keepClosed: true }, options));
      };
    });
  };
};

exports.default = function (opts) {
  return {
    depth: depth,
    partialDepth: partialDepth,
    candles: candles,
    trades: trades,
    aggTrades: aggTrades,
    ticker: ticker,
    allTickers: allTickers,
    user: user(opts)
  };
};