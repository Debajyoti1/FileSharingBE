const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const passport = require('../configs/passport-jwt')

router.post('/signin',userController.signin)
router.post('/signup',userController.signup)
router.get('/profile',passport.authenticate('jwt',{session: false}),userController.profile)
router.get('/profile/:email',userController.profileByEmail)
router.put('/update',passport.authenticate('jwt',{session: false}),userController.update)

module.exports=router