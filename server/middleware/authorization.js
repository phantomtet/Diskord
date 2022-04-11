import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const token = req.header('authorization')
    if (!token) return res.status(401).send({ message: 'Access Denied - No token found'})
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY)        // tra ve payload cua jwt, neu khong thi bao loi
        req.payloadFromJWT = verify
        next()      // chuyen tiep den api tiep theo
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token'})
    }
}
export default verifyToken