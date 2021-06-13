import ws from 'isomorphic-ws'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default url => {
  const rws = new ReconnectingWebSocket(url, [], {
    WebSocket: ws,
    connectionTimeout: 4e3,
    debug: false,
    maxReconnectionDelay: 10e3,
    maxRetries: Infinity,
    minReconnectionDelay: 4e3,
  })

  const pong = () => rws._ws.pong(() => null)

  rws.addEventListener('open', () => {
    // .on only works in node env, not in browser. https://github.com/Ashlar/binance-api-node/issues/404#issuecomment-833668033
    if (rws._ws.on) {
      rws._ws.on('ping', pong)
    }
  })

  return rws
}
