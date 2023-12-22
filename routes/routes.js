const axios = require("axios");
const watchList = require("../models/watchList")
const addLists = require("../models/addLists");
const lists = require("../models/addLists");
const cat = require("../models/category");
const { response } = require("express");

const home = async function (req,res){
  let movie_list = await lists.find();
  let user =req.session.passport.user;
  
  res.render("home",{movie_list,user})

} 
const search = async function(req,res){
    let name = req.body.search;
    const movie = await  axios.get(`https://api.themoviedb.org/3/search/movie?query=${name}&api_key=b86a040dce9e9e20c5bb746f097de03d`)
    const data=movie.data;
    return res.status(200).render("search",{name,data})
}
const searchPage =function(req,res){
    let data ={results:[]}
    return res.render("search",{data})
  }

const addToWatchList = function(req,res){
    const id = req.params.id;
    const userName = req.session.passport.user;
    watchList.create({
      movie_id:id,
      userName:userName
    })
    return res.status(200).send("search")
}

const makeList = async function (req,res){
    const cats = await cat.find({});
    return res.status(200).render("makeList",{cats})
}

const addToList = async  function(req,res){
  let id = req.body.id;
  let name = await  axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=b86a040dce9e9e20c5bb746f097de03d`);
  let data = name.data
  return res.status(200).render("ajaxList",{id,data});
}
const searchMoviesByName = async function (req,res){
  let name = req.body.movie;
    const movie = await  axios.get(`https://api.themoviedb.org/3/search/movie?query=${name}&api_key=b86a040dce9e9e20c5bb746f097de03d`)
    const data=movie.data;
  return res.status(200).render("searchMoviesByName",{data,name});
}

const add_this_list = async function(req,res){
  let array = JSON.parse(req.body.array)
  let fList = await addLists.create({
    name:req.body.category,
    movie_ids:array,
    user_name:req.session.passport.user,
    likes:[]
  })
  

}

const makeCat = async function(req,res){
   let category = req.body.category
    cat.create({
      "name":category
    })

    res.redirect("/makeList");
}

const addLikesList = async function(req,res){
  let usernames = req.body.username;
  let _idss = req.body._id;
  let current_user = req.session.passport.user;
  
  let like_or_not = await addLists.findOne({"user_name":usernames,"_id":_idss,"likes":current_user});
  if(!like_or_not){
     await addLists.updateOne({"user_name":usernames,"_id":_idss},{$push:{likes:current_user}});
     let likess = await addLists.findOne({"user_name":usernames,"_id":_idss});
     total_likes = likess.likes.length
     statuss = true
     res.send({statuss,total_likes})
  }else{
    await addLists.updateOne({"user_name":usernames,"_id":_idss},{$pull:{likes:current_user}});
    let likess = await addLists.findOne({"user_name":usernames,"_id":_idss});
    total_likes = likess.likes.length
    statuss = false
    res.send({statuss,total_likes})
  }
}

const showList = async (req,res) =>{
  let user ="bishan";
  const cats = await cat.find({});


  let movie_list = await lists.find();
  res.render("showLists",{movie_list,user,cats})

}

const filterList = async (req,res) => {
  let user ="bishan";
  let filter_cat = req.body.cat;
  console.log(filter_cat)
  const cats = await cat.find();

  let movie_list = await lists.find({"name":filter_cat});
  console.log(movie_list)
  res.render("showLists",{movie_list,user,cats})


}
module.exports = {home,search,searchPage,addToWatchList,makeList,searchMoviesByName,addToList,add_this_list,makeCat,addLikesList,showList,filterList};
