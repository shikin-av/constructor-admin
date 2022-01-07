const { functions, db, bucket } = require('../firebase')

const deleteMyModel = functions.https.onCall(async (data, context) => {
  const { id } = data
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  try {
    await db.collection(`models/users/${userId}`).doc(id).delete()
    await db.collection('needPublish').doc(id).delete()

  } catch (err) {
    return Promise.reject(new Error(`can't delete model ${id} - ${err}`))
  }

  const imagePath = `${userId}/${id}.png`
  try {
    const image = bucket.file(imagePath)
    image.delete()
  } catch (err) {
    return Promise.reject(new Error(`can't delete image ${imagePath} - ${err}`))
  }

  return Promise.resolve(JSON.stringify({ id }))
})

module.exports = deleteMyModel
