const express=require('express')
const homeRouter=express.Router()

const path=require('path')

homeRouter.get(/^\/$|^\/index(\.html)?/,(req,res)=>{
    res.sendFile('./serverstarter/views/index.html',{root:__dirname})
})

homeRouter.get(/^\/new-page(\.html)?/,(req,res)=>{
    res.sendFile('./serverstarter/views/new-page.html',{root:__dirname})
})

homeRouter.get(/^\/old-page(\.html)?/,(req,res)=>{
    res.redirect(301,'/new-page.html')
})
module.exports=homeRouter