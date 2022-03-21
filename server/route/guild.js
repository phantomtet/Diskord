import express from "express";
import verifyToken from "../middleware/authorization.js";
import { GuildModel } from './../model/guild.js';

const router = express.Router()

router.post('/:guildId', verifyToken, async (req, res) => {
    try {
        const createGuild = GuildModel.create()
    } catch (error) {
        res.status(500).send(error)
    }
})