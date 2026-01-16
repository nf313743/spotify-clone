
import { clerkClient, getAuth } from "@clerk/express";
import { Response, NextFunction, Request } from "express";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req)

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized - you must be logged in' })
        return
    }

    next()
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req)

        const currentUser = await clerkClient.users.getUser(userId ?? '')
        const isAdmin = process.env.ADMIN_EMAIL && currentUser.primaryEmailAddress?.emailAddress

        if (!isAdmin) {
            res.status(403).json({ message: 'Forbidden - admin access required' })
            return
        }

        next()

    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error })
    }
}        