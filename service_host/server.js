require("dotenv").config();
const express=require("express");
const cors=require("cors");
const passport = require("passport");
const cookieSession= require("cookie-session");
const app= experss();
app.use(
    cookieSession({
        name:"session",
        keys:["jashwanth"],
        maxAge:24*60*60*100
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(
    cors({
        origin:"https://localhost:3000",
        methods:"GET,POST,PUT,DELETE",
        credentials:true
    })
)
const port=process.env.PORT || 8080;
app.listen(port , ()=>{console.log(`Listening on port ${port}...`)})