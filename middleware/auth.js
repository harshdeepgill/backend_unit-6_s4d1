const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../Model/blacklist.model");


const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const blacklist = await BlacklistModel.findOne({token});
        if(blacklist){
            res.status(400).send({"msg": "Please login again!"});
        }else{
            jwt.verify(token, 'masai', function(err, decoded) {
                if(decoded){
                    console.log(decoded);
                    req.body.userId = decoded.id;
                    console.log(req.body);
                    next();
                }else{
                    res.status(400).send({"msg": "Token is expired!"})
                }
              });
        }
        
    } catch (err) {
        res.send({"msg": "Error in auth!"});
    }
}

module.exports = {auth};