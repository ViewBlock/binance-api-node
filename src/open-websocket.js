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

  const pong = () => rws._ws.pong(() => null)

  rws.addEventListener('open', () => {
    rws._ws.on('ping', pong)
  })

  return rws
}
