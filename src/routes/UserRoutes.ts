import { Router } from 'express'
import { UserCreate } from '../controllers/user/create'
import { GetUsers } from '../controllers/user/getUsers'
import { GetParamsList } from './Interfaces/interfaceUserRoute'
import { GetUserPerID } from '../controllers/user/getUserPerID'
import { DeleteUserLogic } from '../controllers/user/deleteUserLogic'
import { UserPatch } from '../controllers/user/patch'

const router = Router()

router.post("/create", (req, res) => {
  UserCreate.create(req.body)
    .then((user) => {
      return res.status(user.code).json(user)
    })
    .catch(err => res.status(err.code).json(err))
})

router.get("/get", (req, res) => {

  const params = req.query as unknown as GetParamsList

  GetUsers.getUsers(params.page, params.limit, params.nome, params.emailAcesso, params.funcao, params.ativo, params.sort, params.direction)
    .then((user) => {
      return res.status(user.code).json(user)
    })
    .catch(err => res.status(err.code).json(err))
})

router.get("/get/:id", (req, res) => {
  GetUserPerID.getUserPerID(req.params.id)
    .then((user) => res.status(user.code).json(user))
    .catch(err => res.status(err.code).json(err))
})

router.delete("/delete/:id", (req, res) => {
  DeleteUserLogic.deleteUserLogic(req.params.id)
    .then((user) => res.status(user.code).json(user))
    .catch(err => res.status(err.code).json(err))
})

router.patch("/patch/:id", (req, res) => {
  UserPatch.patch(req.params.id, req.body)
    .then(user => res.status(user.code).json(user))
    .catch(err => res.status(err.code).json(err))
})

export default router