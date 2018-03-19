import WebSocket from 'ws'
import test from 'ava'

import openWebSocket from 'open-websocket'

const TEST_SERVER_PORT = 8080

const server = new WebSocket.Server({ port: TEST_SERVER_PORT })
server.on('connection', ws => {
  ws.on('message', () => server.clients.forEach(client => client.send('test')))
})

test.after.always('cleanup', () => {
  return new Promise(resolve => {
    server.close(() => {
      resolve()
    })
  })
})

test('[WS] reconnect', t => {
  return new Promise(resolve => {
    let isReconnect = false
    const url = () => `ws://localhost:${TEST_SERVER_PORT}`
    const ws = openWebSocket(url)
    ws.onopen = () => {
      if (isReconnect) {
        ws.close(1000, undefined, { keepClosed: true })
        t.pass()
        resolve()
      } else {
        ws.close(1000)
      }
      isReconnect = true
    }
  })
})
