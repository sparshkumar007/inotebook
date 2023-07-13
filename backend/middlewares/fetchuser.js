const jwt=require('jsonwebtoken');

const signature='sparshislearningback$end';

const fetchUser=async(req,res,next)=>{
    const authToken=req.header('authToken');
    if(!authToken)
    {
        res.status(401).send({error:"Please enter valid token"})
    }
    try {
    const data=await jwt.verify(authToken,signature);
    if(!data)
        {
            res.status(401).send({error:"Please enter valid token"});
        }
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"Please enter valid token"});
    }
}

module.exports=fetchUser;