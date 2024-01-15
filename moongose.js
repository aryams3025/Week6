const mongoose=require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/usersdb",{useNewUrlParser:true,useUnifiedTopology:false}).then(()=>{
    console.log("Database connected....");
}).catch(err=>{
    console.log("Not connected...",err);
})

const loginschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Database=new mongoose.model("Login",loginschema);
module.exports=Database;