import { Request, Response, NextFunction } from "express"
import { allowedCountries } from "../constants/countires"

export const geoBlock = (req: Request, res: Response, next: NextFunction) => {
  const country = req.headers["cf-ipcountry"] as string

  if (country && !allowedCountries.includes(country)) {
    return res.status(403).json({
      message: "Access denied"
    })
  }

  next()
}