require('dotenv').config()
const token = require('jsonwebtoken')

const generateJwt = (uniqueKey)=>{
    const tExpiry = 3*24*60*60
    const jwtoken = token.sign({uniqueKey},process.env.TOKEN_SECRET_KEY,{expiresIn:tExpiry})
    return jwtoken
}


module.exports = generateJwt