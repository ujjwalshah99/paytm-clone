const mongoose = require("mongoose");

const connectDB = ()=> {
    mongoose.connect("mongodb+srv://new-ujjwal:sRCJC6Z2bZzZw84W@cluster0.7lq80.mongodb.net/paytm")
    .then(console.log("db connected"))
    .catch((err)=> {
        console.log("database connection error");
    })
}    

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    }
} , {timestamps:true})



const User = mongoose.model("User" , userSchema);

const AccountSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    balance : {
        type: Number,
        default: 0,
        required: true,
    }
})

const Account = mongoose.model("Account" , AccountSchema);

module.exports = {
    User,connectDB,Account
}