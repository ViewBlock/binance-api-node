import httpMethods from 'http'
import wsMethods from 'websocket'

export default (opts = {}) => ({
  ...httpMethods(opts),
  ws: wsMethods(opts),
})
