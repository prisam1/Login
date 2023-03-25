const jwt = require('jsonwebtoken')
const userModel = require("../model/userModel")


const authenticate = function (req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null) 
        return res.sendStatus(401);
      
        if (!token) {
            return res.status(401).send({ status: false, message: "No token found" })
        }
        jwt.verify(token, "blank", function (err, decodedToken) {
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

 
//  const refreshToken = async(req, res) => {
//     try {
//         const refreshToken = req.cookies.refreshToken
//         if(!refreshToken)
//          return res.sendStatus(401)
//         const user = await userModel.find({
//             where:{
//                 refresh_token: refreshToken
//             }
//         });
//         if(!user) return res.sendStatus(403)
//         jwt.verify(refreshToken, req.decodedToken, (err, decoded) => {
//             if(err) return res.sendStatus(403)
//             const userId = user.id
//             const name = user.name
//             const email = user.email
//             const accessToken = jwt.sign({userId, name, email}, "HiPal",{
//                 expiresIn: '15s'
//             });
//             res.json({ accessToken });
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }
module.exports={authenticate}