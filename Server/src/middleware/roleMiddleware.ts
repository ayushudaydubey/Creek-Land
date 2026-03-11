import { Request, Response, NextFunction } from "express"

export const roleMiddleware = (requiredRole: string) => {
  return (req: any, res: Response, next: NextFunction) => {

    try {

      const user = req.user

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized"
        })
      }

      if (user.role !== requiredRole) {
        return res.status(403).json({
          message: "Access denied"
        })
      }

      next()

    } catch (error) {

      res.status(500).json({
        message: "Server error"
      })
    }
  }
}