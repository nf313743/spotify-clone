import { Router } from "express";
import { User } from "../models/user.model";
import { authCallback } from "../controller/auth.controller";


const router = Router()

router.post('/callback', authCallback)

export default router