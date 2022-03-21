import express from "express";
import verifyToken from "../middleware/authorization.js";
import { UserModel, userPrivateFields } from '../model/user.js';

const router = express.Router()

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId, {...userPrivateFields})
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})
export default router