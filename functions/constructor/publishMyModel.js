const { functions, db } = require('../firebase')

const publishMyModel = functions.https.onCall(async (data, context) => {
  const { id } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  try {
    const modelDoc = await db.collection(`models/users/${userId}`).doc(id).get()
    if (!modelDoc.exists) {
      return Promise.reject(new Error(`can't publish model ${id} - ${e}`))
    }

    const model = modelDoc.data()
    model.published = true

    await db.collection(`models/users/${userId}`).doc(id).set(model)

    const publishData = {
      userId,
      modelId: id,
      date: new Date(),
    }
    await db.collection('needPusblish').doc(id).set(publishData)
    
    return Promise.resolve(JSON.stringify({ id }))
  } catch (e) {
    return Promise.reject(new Error(`can't publish model ${id} - ${e}`))
  }
})

module.exports = publishMyModel
