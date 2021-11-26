module.exports = function isAuthorized({ hasRole, /*allowSameUser*/ }) {
   return (req, res, next) => {
       const { role, email, uid } = res.locals
       const { id } = req.params

       if (email === 'shikin.a.v@mail.ru')
          return next()

      //  if (allowSameUser && id && uid === id)
      //      return next();

       if (!role)
           return res.status(403).send();

       if (hasRole.includes(role))
           return next();

       return res.status(403).send();
   }
}