const { functions, db } = require('../firebase')

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

  try {
    const doc = await db.collection(`models/users/${userId}`).doc(id).get()

    const model = !!doc.exists
      ? doc.data()
      : {
        details: [],
        colors: [],
        userId,
        published: false,
        likes: 0,
      }

    model.updatedAt = new Date().getTime()
    model.details = details.sort((d1, d2) => d1.q - d2.q)
    model.colors = colors
    model.detailsCount = details.length
    model.buildedCount = 0  // если в свою модель внести изменения - то "собирать" нужно заного
    model.buildedLastDetails = []

    await db.collection(`models/users/${userId}`).doc(id).set(model)

    return Promise.resolve(JSON.stringify({ id }))
  } catch (err) {
    return Promise.reject(new Error(`can't save model ${id} - ${err}`))
  }
})

module.exports = saveMyModel
