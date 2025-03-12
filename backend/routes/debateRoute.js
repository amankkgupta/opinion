const express= require("express");
const { CreateDebate, MyDebates, LikeDebate } = require("../controllers/Debates");
const {Authjwt} = require("../middlewares/Authjwt");

const DebateRoutes= express.Router();

DebateRoutes.post("/create", Authjwt, CreateDebate);
DebateRoutes.get("/mydebates",Authjwt, MyDebates);
DebateRoutes.get("/likerequest",Authjwt, LikeDebate);


module.exports=  DebateRoutes;