import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId: currentUserId } = getAuth(req)
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId: myId } = getAuth(req)
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};
