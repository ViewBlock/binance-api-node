import Html5WebSocket from 'html5-websocket'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default url => {
  return new ReconnectingWebSocket(url, undefined, {
    connectionTimeout: 4E3,
    constructor: typeof window !== 'undefined' ? WebSocket : Html5WebSocket,
    debug: false,
    maxReconnectionDelay: 10E3,
    maxRetries: Infinity,
    minReconnectionDelay: 4E3,
  })
}
