import http from 'http';

export const checkFields = (t, object, fields) => {
  fields.forEach(field => {
    t.truthy(object[field])
  })
}

const generatePort = (() => {
  let portNum = parseInt(9000 + (65535 - 9000) * Math.random(), 10);
  return () => portNum++;
})()

export const createHttpServer = (requestHandler) => {
  const server = http.createServer(requestHandler);
  const port = generatePort();
  return {
    url: `http://127.0.0.1:${port}`,
    start: () => new Promise((resolve, reject) =>
      server.listen(port, err => err ? reject(err) : resolve())
    ),
    stop: () => new Promise((resolve, reject) =>
      server.close(err => err ? reject(err) : resolve())
    ),
  }
}
