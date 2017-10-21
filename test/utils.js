export const checkFields = (t, object, fields) => {
  fields.forEach(field => {
    t.truthy(object[field])
  })
}
