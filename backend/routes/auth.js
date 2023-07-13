const express=require('express');
const User=require('../models/User');
const router=express.Router();
const {body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchUser=require('../middlewares/fetchuser');

const signature='sparshislearningback$end';

//Route 1: Create a user using POST "/api/auth/createuser". no login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:5}),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({min:5})
],async(req,res)=>{
    
    // if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(errors);
    }
    
    // using try catch to avoid any problem in future
    try {
        
        // check wether the user with same email already exists.
        let user = await User.findOne({email:req.body.email});
        if(user)
        {
            return res.status(400).json({error:"Sorry! Email already exists"});
        }
        
        // creating a secured password out of provided password using salt
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        
        // creating new user
        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass
        });
        
        const data={
        user:{
            id: user.id
        }
    }
    const authToken=jwt.sign(data,signature);
    // res.send(user);
    res.send({authToken});
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

//Route 2: Authenticate a user using POST "/api/auth/loginuser". no login required
router.post('/loginuser',[
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').exists()
],async (req,res)=>{
    // if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(errors); 
    }
    const {email,password}=req.body;
    try {
        // checking login credentials
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).send({"error":"Please try to login with correct credentials"});
        }
        const passCompare=await bcrypt.compare(password,user.password);
        if(!passCompare)
        {
            return res.status(400).send({"error":"Please try to login with correct credentials"});
        }
        
        // if credentials matched now return authToken
        const data={
            user:{
                id: user.id
            }
        }
        const authToken=jwt.sign(data,signature);
        res.send({authToken});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route 3: Authenticate a user using POST "/api/auth/getuser". Login required
router.post('/getuser',fetchUser,async (req,res)=>{
    try {
        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports=router;