import express from 'express'
import { googleAuth } from '../controllers/auth.controller.js'

export const AuthRoutes = express.Router()

AuthRoutes.post('/google', googleAuth)
