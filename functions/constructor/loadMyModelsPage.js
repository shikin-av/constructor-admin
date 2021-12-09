const { functions, db } = require('../firebase')

const loadMyModelsPage = functions.https.onCall(async (data, context) => {
  const { startAt, limit } = data   // TODO:
  const userId = context.auth.uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (isNaN(startAt)) return Promise.reject(new Error('startAt is NaN'))
  if (isNaN(limit)) return Promise.reject(new Error('limit is NaN'))

  try {
    const collection = await db.collection(`models/users/${userId}`)
      .orderBy('updatedAt', 'desc').get()

    const models = collection.docs.map(doc => {
      const { 
        userId, 
        colors = [],
        detailsCount = 0,
        likes = 0,        
        published = false,
      } = doc.data()

      return {
        id: doc.id,
        userId,
        colors,
        detailsCount,
        likes,
        published,
      }
    })

    // TODO - стартуя с startAt с количеством limit

    return Promise.resolve(JSON.stringify({ models }))
  } catch (err) {
    return Promise.reject(new Error(`can't load model page with userId:${userId}, startAt:${startAt}, limit:${limit} - ${err}`))
  }
})

module.exports = loadMyModelsPage
