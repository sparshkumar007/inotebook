const express=require('express');
const User=require('../models/User');
const router=express.Router();
const {body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const signature='sparshislearningback$end';

// create a user using POST "/api/auth/createuser". no login required
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
        res.status(500).send("Some Error Occured");
    }
})

module.exports=router;