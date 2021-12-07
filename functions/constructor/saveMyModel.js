const { functions, db } = require('../firebase')
const sizeof = require('object-sizeof')

const saveMyModel = functions.https.onCall(async (data, context) => {
  let { id, details, colors } = data
  const userId = context.auth.uid
  details = JSON.parse(details)
  colors = JSON.parse(colors)

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))
  if (!details) return Promise.reject(new Error('doesn`t have details'))
  if (!Array.isArray(details)) {
    return Promise.reject(new Error(`"details" must be an array - ${details}`))
  }
  if (!Array.isArray(colors)) {
    return Promise.reject(new Error(`"colors" must be an array - ${colors}`))
  }

  console.log('=======================================')
  // console.log(data)
  // console.log(context)
  console.log('SIZE data', sizeof(data))
  console.log('SIZE context', sizeof(context))
  console.log('=======================================')
  
  let model = {}

  //   /* TODO: проверка - если bl с таким id уже есть 
  //   * => сгенерить новый id и вернуть на клиент
  //   * return Promise.resolve(JSON.stringify({ id }))
  //   */

  try {
    const doc = await db.collection(`models/users/${userId}`).doc(id).get()
    if (!doc.exists) { // new
      model = {
        details: [],
        colors: [],
        userId,
        published: false,
      }
    } else {
      model = doc.data()
    }
  } catch (e) {
    return Promise.reject(new Error(`can't get model ${userId} ${id} - ${e}`))
  }

  model.updatedAt = new Date().getTime()
  model.details = details.sort((d1, d2) => d1.q - d2.q)
  model.colors = colors

  try {
    await db.collection(`models/users/${userId}`).doc(id).set(model)
    return Promise.resolve(JSON.stringify({ id }))
  } catch (e) {
    return Promise.reject(new Error(`can't save model ${id} - ${e}`))
  }
})

module.exports = saveMyModel
