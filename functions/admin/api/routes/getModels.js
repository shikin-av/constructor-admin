const {db} = require('../../../firebase')

const getModels = async (req, res) => {
  const {userId} = req.params

  try {
    const snapshot = await db.collection(`models/users/${userId}`)
      .orderBy('updatedAt', 'desc').get()

    const models = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        userId,
      }
    })

    return Promise.resolve(res.json({ models }))
  } catch (e) {
    return Promise.reject(new Error(`can't load model page with userId:${userId}`))
  }
}

module.exports = getModels
