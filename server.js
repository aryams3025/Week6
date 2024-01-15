const express=require('express');
const app=express();
const router=require('./router');
const adminrouter=require('./adminrouter');
const path=require('path');
const session=require('express-session');
const {v4:uuidv4}=require("uuid");
const nocache=require("nocache");
const Port=process.env.Port||3001;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//setting view engine
app.set('view engine','ejs')

//adding style
app.use('/static',express.static(path.join(__dirname,'public')));

//adding assets
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

//nocache
app.use(nocache());

//session setup
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:false
}))

app.use("/",router)
app.use("/",adminrouter)

app.listen(Port,()=>console.log(`Server is running at http://localhost:${Port}/`))