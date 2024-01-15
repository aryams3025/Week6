const express=require('express');
const adrouter=express.Router();
const datas=require('./moongose');
const session=require('express-session');

//admin credentials

const admin={
    name:"Arya",
    id:"arya123",
    password:"arya123"
}

adrouter.get("/adminhome",(req,res)=>{
    if(req.session.adminlog){
        res.redirect("/admin_home");
    }
    else{
        res.render("admin",{title:'Admin login',msg:null})
    }
})

//admin home page

adrouter.get('/admin_home',async(req,res)=>{
    if(req.session.adminlog){
        var n=0;
        const userdata=await datas.find({},{__v:0})
        res.render('adminhome',{title:"Admin home",user:req.session.user,userdata,n})
    }
    else{
        res.redirect('/adminhome');
    }
})

//admin login
adrouter.post('/adminlog',(req,res)=>{
    if(admin.id===req.body.id && admin.password===req.body.password){
        req.session.user=admin.name;
        req.session.adminlog=true;
        res.redirect('/admin_home')
    }
    else{
        if(req.body.id!=admin.id){
            res.render('admin',{title:"Admin login",msg:"Wrong credential"});
        }
        else if(req.body.password!=admin.password){
            res.render('admin',{title:"Admin login",msg:"Wrong password"});
        }
        else{
            res.render('admin',{title:"Admin login",msg:"Wrong credentials"});
        }
    }
});

//Edit User details
adrouter.route("/edit/:id").get(async(req,res)=>{
    if(req.session.adminlog){
        const id=req.params.id;
        const data =await datas.findOne({_id:id});
        res.render('edit',{title:'update',data});
    }
    else{
        res.redirect('/adminhome')
    }
}).post(async(req,res)=>{
    const id=req.params.id;
    const data=req.body;
    await datas.updateOne({_id:id},{$set:{name:data.name,email:data.email}});
    res.redirect("/admin_home")
})


//add

adrouter.route('/add').get((req,res)=>{
    if(req.session.adminlog){
        res.render('add',{title:"Add User",msg:req.session.msgsign})
    }
    else{
        res.redirect('/adminhome')
    }
}).post(async(req,res)=>{
    const check=await datas.findOne({email:req.body.email});
    if(check==null){
        const data={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }
        await datas.insertMany([data]);
        res.redirect('/admin_home')
    }else{
        req.session.msgsign="User already exists"
        res.redirect('/add')
    }
});

//search

adrouter.post('/search',async(req,res)=>{
    const n=0;
    const data=req.body
    const userdata=await datas.find({name:{$regex:"^"+data.search,$options:'i'}});
    res.render('adminhome',{title:'Home',user:req.session.user,userdata,n})
})

//Delete

adrouter.get("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    let delted=await datas.deleteOne({_id:id});
    res.redirect('/admin_home')
})
module.exports=adrouter;