import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

export const authCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        const user = await User.findOne({ clerkId: id });

        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName ?? ''} ${lastName ?? ''}`,
                imageUrl
            });
        }

        res.status(200).send({ success: true });

    }
    catch (error) {
        next(error);
    }
}