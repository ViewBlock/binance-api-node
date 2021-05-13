import ws from 'isomorphic-ws'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default (url,proxyOpt) => {
  const rws = new ReconnectingWebSocket(url, [], {
    WebSocket: ws,
    connectionTimeout: 4e3,
    debug: false,
    maxReconnectionDelay: 10e3,
    maxRetries: Infinity,
    minReconnectionDelay: 4e3,
    ...proxyOpt
  })

  const pong = () => rws._ws.pong(() => null)

  rws.addEventListener('open', () => {
    rws._ws.on('ping', pong)
  })

  return rws
}
