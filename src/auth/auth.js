const jwt = require('jsonwebtoken')

const authenticate = function (req, res, next) {
    try {
      
        let token = req.headers["token"]
        if (!token) {
            return res.status(400).send({ status: false, message: "No token found" })
        }
        jwt.verify(token, "HiPal", function (err, decodedToken) {
            if (err) {
                return res.status(401).send({ status: false, message: err.message })
            }
            req.decodedToken = decodedToken
            console.log(decodedToken)
            next()
        })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports={authenticate}