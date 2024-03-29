const { functions, db } = require('../firebase')

const loadMyModel = functions.https.onCall(async (data, context) => {
  const { id } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  try {
    const doc = await db.collection(`models/users/${userId}`).doc(id).get()
    if (!doc.exists) {
      return Promise.reject(new Error(`No such document! ${id}`))
    }

    const model = doc.data()
    model.userId = userId

    return Promise.resolve(JSON.stringify(model))
  } catch (err) {
    return Promise.reject(new Error(`can't load model ${id} - ${err}`))
  }  
})

module.exports = loadMyModel
