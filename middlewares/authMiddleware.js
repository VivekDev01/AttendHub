import jwt from "jsonwebtoken"

export default async(req, res, next) =>{
    try {
        // console.log(req.headers);
        // console.log( req.header('Authorization'))
        const token = req.header('Authorization').split(" ")[1];
        // console.log(token);
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if(err){
            console.log(err)
            return res.status(200).send({
                message:"Authorization Failed1",
                success: false
            })
        }
        else{
            req.body.userId = decode.id ;
            next()
        }
    })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message:"Authorization Failed2",
            success: false
        });
    }
}