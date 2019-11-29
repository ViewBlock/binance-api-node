import WebSocket from 'ws'
import test from 'ava'

import openWebSocket from 'open-websocket'

const port = 8084

let server = new WebSocket.Server({ port })

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

test.only('[WS] reconnect when server is restarted', t => {
  return new Promise((resolve, reject) => {
    try {
      let isReconnect = false
      const url = () => `ws://localhost:${port}`
      const ws = openWebSocket(url)

      ws.addEventListener('open', () => {
        if (isReconnect) {
          ws.close(1000, undefined, { keepClosed: true })
          t.pass()
          resolve()
        } else {
          server.close()
          server = new WebSocket.Server({ port })
        }

        isReconnect = true
      })
    } catch (err) {
      reject(err)
    }
  })
})
