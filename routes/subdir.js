const express=require('express')
const subdirrouter=express.Router()

const path=require('path')

subdirrouter.get(/^\/$|^\/index(\.html)?/,(req,res)=>{
    res.sendFile('./serverstarter/views/subdir/index.html',{root:__dirname})
})
subdirrouter.get(/^\/test(\.html)?/,(req,res)=>{
    res.sendFile('./serverstarter/views/subdir/test.html',{root:__dirname})
})
module.exports=subdirrouter