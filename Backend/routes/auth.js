const express = require('express');
const {User} = require('../model/Models');
const router = express.Router();
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "Thisismysecret";

//Route 1 : Creating a user /api/auth/createuser . No login required
router.post('/createuser', [
    body('sname', 'Enter a valid Name').isLength({min:2}),
    body('semail', 'Enter a valid Email').isEmail(),
    body('spassword', 'Enter a valid Password').isLength({min:8})
], async (req, res) => {
    //If there are errors return bad request message
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }

    try {
    let user = await User.findOne({email: req.body.semail});
    if(user){
        return res.status(400).json({success, error: "Email is been already used "})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.spassword, salt);
    user = await User.create({
        name: req.body.sname,
        email: req.body.semail,
        password: secPass
    })

    const data = {user:{id:user.id}};
    const authToken = jwt.sign(data, JWT_SECRET); 
    success = true;
    res.json({success, authToken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");  
    }
})

//Route 2 : Authenticating a user using POST : "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    //If there are errors return bad request message
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }
        
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const userid = user.id
        const username = user.name
        const data = {user:{id:user.id}};
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken, userid, username});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router