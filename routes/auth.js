const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//Register
router.post("/register", async (req,res) => {
    

    try {
        //Encrypting user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        //Creating new user
        const newUser = await User({
            username: req.body.username,
            email: req.body.email,
            password:hashedPassword
        })

        //save user and return
       const user =  await newUser.save();
       res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
  

   res.send("ok")
})

//Login

router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email})
        !user && res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("Incorrect password or email");

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;