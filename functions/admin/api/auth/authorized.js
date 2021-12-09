module.exports = function isAuthorized({ roles = [], allowSameUser = false }) {
   return (req, res, next) => {
       const { role, email, uid } = res.locals
       const { id } = req.params

       if (allowSameUser && id && uid === id) {
        return next()
       }           

       if (!role) {
        return res.status(403).send()
       }

       if (roles.includes(role)) {
        return next()
       }

       return res.status(403).send();
   }
}
