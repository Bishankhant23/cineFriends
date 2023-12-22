const express = require("express");
const users= require("./models/userModel");
const posts = require("./models/postModel");
const watchList = require("./models/watchList")

const path = require("path")
const axios = require("axios");
const routess = require("./routes/routes")

const app = express();
const expressSession = require("express-session");
const passport = require("passport");
const localStat= require("passport-local");
const multer = require("multer");
const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

const DB = 'mongodb+srv://bishanpatel123:VIRAL%405199@cluster0.xdxgury.mongodb.net/cinefriends?retryWrites=true&w=majority'
mongoose.connect(DB).then(()=>{
    console.log("established")
}).catch((err)=>{
    console.log(err)
})
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination:function(req,file,cb){
     return cb(null,"./upload")
  },
  filename:function(req,file,cb){
    return cb(null,`${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({storage})
passport.use( new localStat(users.authenticate()));

app.set("view engine","ejs");

app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:"heyyyyy cinephile"

}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended:false}))

passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.post("/editProfile",upload.single("image"),async function(req,res){
  let image = req.file.filename;
  let userss = req.session.passport.user;
  const imagess = await users.findOneAndUpdate({username:userss},{
    $set : {
      image : image
    }
  })
  return res.send(imagess)
})

app.get("/profile",isloggedin,async function(req,res){
  let user = req.session.passport.user;
  let userss = await  users.findOne({username:user})
  let allPosts = await posts.find({"user_id":userss._id})

  let paths = path.join(__dirname, './upload')
  console.log(user)
   res.render("profile",{userss,paths,allPosts})
})
app.get("/register", async function(req , res){

    return res.render("register");
})

app.get("/searchMovies",routess.searchPage)

app.post("/searchMovies",routess.search)

app.get("/addToWatchList/:id",isloggedin,routess.addToWatchList)

app.post("/register", async function(req,res){
      let username = req.body.username;
      let email = req.body.email; 
      
      const userdata = new users({
        "username":username,
        "email":email
      })

      users.register(userdata,req.body.password)
      .then(()=>{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/profile")
        })
      }).catch((err)=>{
        console.log(err)
      })
})

app.get("/login",function(req,res){
    res.render("login")
});

app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
})),function(req,res){

}
app.get("/logout",function(req,res){
  req.logout(function(err){
    if(err) { return next(err)}
    res.redirect("/login")
  })
})
app.post("/createPost",upload.single("image"),async function(req,res){
  let userss = req.session.passport.user;

  const user_id = await  users.findOne({"username":userss})

  const postss = await posts.create({
    imagename:req.file.filename,
    caption:"heyyy",
     user_id:user_id._id
   })
  
   user_id.posts.push(postss._id);

   const allPosts = await posts.find({user_id:user_id._id})
   return res.send(allPosts)
})
function isloggedin(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

app.get("/discover/:name" ,async function(req,res){
let page =1;
let search = req.body.search
console.log(search)
const movies = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=b86a040dce9e9e20c5bb746f097de03d&language=en-US&page=${page}`)
const data = movies.data.results
res.render("discover",{data,search})
})

app.get("/makeList",routess.makeList);
app.post("/searchMoviesByName",routess.searchMoviesByName)
app.post("/addToList",routess.addToList);
app.post("/add_this_list",routess.add_this_list)
app.post("/addCategory",routess.makeCat);
app.post("/addlikes",routess.addLikesList)
app.get("/",isloggedin,routess.home)
app.get("/alllists",routess.showList)
app.post("/filterList",routess.filterList)
app.listen(3000);
