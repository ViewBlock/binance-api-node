import ws from 'ws'
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
  // https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md
  // The websocket server will send a ping frame every 3 minutes. If the websocket server
  // does not receive a pong frame back from the connection within a 10 minute period,
  // the connection will be disconnected.
  const noop = () => undefined
  const pong = () => rws._ws.pong(noop)
  const addPingListener = () => rws._ws.on('ping', pong)
  rws.addEventListener('open', addPingListener)
  return rws
}
