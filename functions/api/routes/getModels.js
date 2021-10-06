const {db} = require('../../firebase')

module.exports = async (req, res) => {
  const {userId} = req.params
  return db
    .collection(`models/users/${userId}`)
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshot) => {
      const models = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId,
      }))
      return res.json(models)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({error: err.code})
    })
}
