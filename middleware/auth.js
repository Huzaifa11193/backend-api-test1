const jwt= require('jsonwebtoken');
const User = require("../models/User");


const secretKey = process.env.KEY;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1]; // Split the header and extract the token
    if (!token) return res.status(403).json({ message: 'No token provided.' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded;
        next();
    });
};


const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const data = await User.findOne({email,password});
        if(!data) return res.status(401).json({message:'Email & password not found'});

        const token = jwt.sign({  email : data.email , name : data.name , id : data.id  }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({token});

    }catch(err){
        res.status(400).json({message:err.message })
    }

}


module.exports = {
    login,verifyToken
}
