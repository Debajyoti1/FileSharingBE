// Require the express module and create a new router object
const express=require('express')
const router=express.Router()
router.use('/',require('./home'))
router.use('/user',require('./user'))
router.use('/file',require('./file'))

module.exports=router