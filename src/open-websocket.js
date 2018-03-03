import Html5WebSocket from 'html5-websocket'
import ReconnectingWebSocket from 'reconnecting-websocket'
import WebSocket from 'ws'

export default wsAddressBuilder => {
  return new ReconnectingWebSocket(
    wsAddressBuilder,
    undefined,
    {
      connectionTimeout: 4000,
      constructor: typeof window !== 'undefined' ? WebSocket : Html5WebSocket,
      debug: false,
      maxReconnectionDelay: 10000,
      maxRetries: Infinity,
      minReconnectionDelay: 4000,
    }
  );
}
