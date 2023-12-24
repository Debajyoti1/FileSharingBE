const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')
const passport = require('../configs/passport-jwt')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
})

const limits = {
    fileSize: 2048 * 1024 * 1024, // 2GB limit
};
const limitsNoAuth={
    fileSize: 256 * 1024 * 1024 // 256MB limit
}
const upload = multer({
    storage: storage,
    limits: limits
})
const uploadNoAuth = multer({
    storage: storage,
    limits: limitsNoAuth
})
router.post('/upload',passport.authenticate('jwt', { session: false }), upload.array('files'), fileController.upload)
router.post('/uploadnoauth',uploadNoAuth.array('files'), fileController.uploadNoAuth)
router.post('/delete', passport.authenticate('jwt', { session: false }), fileController.delete)
router.get('/info/:id',fileController.getFileInfoById)
router.post('/info/',fileController.getFileInfoByIdMulti)
router.get('/download/:id',fileController.downloadById)
module.exports = router