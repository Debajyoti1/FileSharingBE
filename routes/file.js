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

const upload = multer({
    storage: storage,
    limits: limits
})

router.post('/upload', passport.authenticate('skipjwt', { session: false }), upload.array('files'), fileController.upload)
router.post('/delete', passport.authenticate('jwt', { session: false }), fileController.delete)

module.exports = router