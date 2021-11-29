const { admin } = require('../../../firebase')

module.exports = async function isAuthenticated(req, res, next) {
    const unauthorized = () => res.status(401).send({ message: 'Unauthorized' })

   const { token } = req.headers

   if (!token) return unauthorized()

   if (!token.startsWith('Bearer')) return unauthorized()

   const split = token.split('Bearer ')
   if (split.length !== 2) return unauthorized()

   try {
       const decodedToken = await admin.auth().verifyIdToken(split[1]);
    //    console.log('decodedToken', JSON.stringify(decodedToken))
       res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email }
       return next()
   }
   catch (err) {
       console.error(`${err.code} -  ${err.message}`)
       return unauthorized()
   }
}