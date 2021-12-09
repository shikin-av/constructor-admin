const express = require('express')
const { admin } = require('../../../firebase')
const { error500 } = require('../utils/handleErrors')
const isAuthorized = require('../auth/authorized')
const { ROLES: { ADMIN, MANAGER } } = require('../auth/constants')

const usersRouter = express.Router()
usersRouter
  .post('/',
    isAuthorized({ roles: [ADMIN] }),
    create
  )
  .get('/', [
    isAuthorized({ roles: [ADMIN] }),
    all
  ])
  .get('/:id', [
    isAuthorized({ roles: [ADMIN, MANAGER], allowSameUser: true }),
    get
  ])
  .patch('/:id', [
    isAuthorized({ roles: [ADMIN] }),
    patch
  ])
  .delete('/:id', [
    isAuthorized({ roles: [ADMIN] }),
    remove
  ])
  .post('/role',
    isAuthorized({ roles: [ADMIN] }),
    setRole
  )

  async function create(req, res) {
   try {
       const { displayName, password, email, role } = req.body

       if (!displayName || !password || !email || !role) {
           return res.status(400).send({ message: 'Missing fields' })
       }

       const { uid } = await admin.auth().createUser({
           displayName,
           password,
           email
       })
       await admin.auth().setCustomUserClaims(uid, { role })

       return res.status(201).send({ uid })
   } catch (err) {
       return error500(res, err)
   }
}

async function all(req, res) {
  try {
      const listUsers = await admin.auth().listUsers()
      const users = listUsers.users.map(mapUser)
      return res.status(200).send({ users })
  } catch (err) {
      return error500(res, err)
  }
}

function mapUser(user) {
  const customClaims = (user.customClaims || { role: '' })
  const role = customClaims.role ? customClaims.role : ''
  return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime
  }
}

async function get(req, res) {
 try {
     const { id } = req.params
     const user = await admin.auth().getUser(id)
     return res.status(200).send({ user: mapUser(user) })
 } catch (err) {
     return error500(res, err)
 }
}

async function patch(req, res) {
 try {
     const { id } = req.params
     const { displayName, password, email, role } = req.body

     if (!id || !displayName || !password || !email || !role) {
         return res.status(400).send({ message: 'Missing fields' })
     }

     await admin.auth().updateUser(id, { displayName, password, email })
     await admin.auth().setCustomUserClaims(id, { role })
     const user = await admin.auth().getUser(id)

     return res.status(200).send({ user: mapUser(user) })
 } catch (err) {
     return error500(res, err)
 }
}

async function remove(req, res) {
 try {
     const { id } = req.params
     await admin.auth().deleteUser(id)
     return res.status(200).send({})
 } catch (err) {
     return error500(res, err)
 }
}

async function setRole(req, res) {
  try {
    const { email, role } = req.body

    let user = await admin.auth().getUserByEmail(email)
    await admin.auth().setCustomUserClaims(user.uid, { role })

    user = await admin.auth().getUserByEmail(email)
    return res.status(200).send({ user: mapUser(user) })
  } catch (err) {
    return error500(res, err)
  }
}

module.exports = usersRouter
