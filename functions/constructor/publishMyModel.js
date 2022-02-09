const { functions, db, bucket } = require('../firebase')

const publishMyModel = functions.https.onCall(async (data, context) => {
  const { id } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  try {
    const doc = await db.collection(`models/users/${userId}`).doc(id).get()
    if (!doc.exists) {
      return Promise.reject(new Error(`can't publish model ${id} - ${e}`))
    }

    const model = doc.data()

    if (!model.published) {
      model.published = true
      await db.collection(`models/users/${userId}`).doc(id).set(model)
    }    

    const publishData = {
      ...model,
      modelId: id,
      publishedAt: new Date(),
      approved: false,
      inSteps: 0,
    }
    await db.collection('needPublish').doc(id).set(publishData)

    // update image
    await bucket.file(`${model.userId}/${id}.png`)
      .copy(`needPublish/${id}.png`)
    
    return Promise.resolve(JSON.stringify({ id }))
  } catch (err) {
    return Promise.reject(new Error(`can't publish model ${id} - ${err}`))
  }
})

module.exports = publishMyModel
