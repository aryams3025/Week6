const express=require('express');
const router=express.Router();
const datas=require('./moongose');


//login page route
router.get('/',(req,res)=>{
    if(req.session.loged){
        res.redirect('/home')
    }
    else{
        res.render('login',{title:"Login",msg:req.session.msg})
    }
})

//signup
router.get('/signup',(req,res)=>{
    res.render('signup',{title:"Signup",msg:req.session.msgsign})
})

//user login
const pro=[
    {
        name:"Taj mahal",
        imgurl:"/assets/taj.jpg"
    },
    {
        name:"Mumbai",
        imgurl:"/assets/mumbai.jpg"
    },
    {
        name:"Mysore",
        imgurl:"/assets/mysore.jpg"
    },
    {
        name:"Rajasthan",
        imgurl:"/assets/raj.png"
    },
    {
        name:"Delhi",
        imgurl:"/assets/delhi.jpg"
    },
    {
        name:"Uttakhand",
        imgurl:"/assets/uttarakhand.jpeg"
    },
];
router.get('/home',(req,res)=>{
    if(req.session.loged){
        return res.render('index',{
            title:'Home',
            name:req.session.name,
            pro:pro,
    })
   }
});

//login 

router.post('/login',async(req,res)=>{
    req.session.loged=false
    try{
        const check=await datas.findOne({email:req.body.email})
        if(check.password===req.body.password){
            req.session.name=check.name;
            req.session.loged=true;
            res.redirect('/home')
        }
        else{
            req.session.msg="Invalid User";
            res.redirect('/');
        }
    }catch{
        req.session.msg="Invalid User";
        res.redirect('/');
    }
})

//user signup

router.get('/signup',(req,res)=>{
    res.render('signup',{title:"Sign up",msg:req.session.msgsign})
})

router.post('/signupage',async(req,res)=>{
    const check=await datas.findOne({email:req.body.email})
    if(check==null){
        const data={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }
        await datas.insertMany([data]);
        res.redirect('/');
    }else{
        req.session.msgsign="User already exists";
        res.redirect('/signup');
    }
})


// log out
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/');
        }
    })
})


module.exports=router;