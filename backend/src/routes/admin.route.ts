import { Router } from "express";
import { getAdmin } from "../controller/admin.controller";


const router = Router()

router.get('/', getAdmin)

export default router