import geoip from "geoip-lite"
import requestIp from "request-ip"

export const geoBlockMiddleware = (req: any, res: any, next: any) => {
    const ip = requestIp.getClientIp(req) || ""

    // Allow local development and common localhost addresses
    if (
        process.env.NODE_ENV === "development" ||
        ip === "::1" ||
        ip === "127.0.0.1" ||
        ip.startsWith("::ffff:127.0.0.1")
    ) {
        return next()
    }

    const geo = geoip.lookup(ip)

    const allowedCountries = ["US", "CA", "IN"]

    if (!geo || !allowedCountries.includes(geo.country)) {
        return res.status(403).json({
            message: "Access blocked in your region"
        })
    }

    next()
}