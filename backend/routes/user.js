const express = require("express");
const zod = require("zod");
const router = express.Router();
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const {authMiddleware} = require("../middleware");

const signupSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup" , async (req,res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success) {
        return res.json({
            msg: "there is credencial error"
        })
    }
    const user = User.findOne({
        email: body.email
    })

    if(user) {
        return res.status(411).json({
            msg : "email is already taken"
        })
    }

    const dbUser = await User.create(body);

    const token = jwt.sign({
        userId : dbUser._id
    } , JWT_SECRET);

    res.json({
        msg : "user created successfully",
        token : token
    })
})

const signinSchema = zod.object({
    email: zod.string(),
    password: zod.string()
})

router.post("/signin" , async  (req,res)=> {
    const body = req.body;

    const {success} = signinSchema.safeParse(body);

    if(!success) {
        res.status(411).json({
            msg: "invalid email / password"
        })
    }

    const dbUser = await User.findOne({
        email : body.email,
        password: body.password
    })

    if(dbUser) {
        const token = jwt.sign({
            userId: dbUser._id
        } , JWT_SECRET)

        res.json({
            msg : "user is found",
            token : token
        })
    }

    res.json({
        msg: "there was an error while signin"
    })
})

const updateBody = zod.object({
    password: string().optional(),
    firstName: string().optional(),
    lastName: string().optional(),
})

router.put("/" , authMiddleware , async (req,res)=> {
    const body = req.body;
    const userId = req.userId;

    const {success} = updateBody.safeParse(body);
    if (!success) {
        res.status(411).json({message: "Error while updating information"})
    }
    
    const user = await User.findOneAndUpdate({
        _id: userId,
    } , body);
    res.status(200).json({message: "Updated successfully"});
})

router.get("/bulk" , (req,res) => {
    const filter = req.params.filter || "";

    const users = User.find({
        $or: [{
            firstName: {
                "$regex" : filter
            }
        },{
            lastName: {
                "$regex" : filter
            }
        }]
    })

    res.json({
        user : users.map((user)=> ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }))
    })
})

module.exports = router;