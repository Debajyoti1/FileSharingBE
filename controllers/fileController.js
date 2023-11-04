const User = require('../models/user')
const File = require('../models/file')


module.exports.upload = async (req, res) => {
    try {
        // console.log(req.files);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'No files were uploaded.',
            });
        }
        const uploadedFiles = [];
        const user = req.user || await User.findById('65339d61b7e69e26479766b0')
        for (const file of req.files) {
            const newFile = await File.create({
                user: user,
                name: file.filename,
                actualName: file.originalname,
            });
            user.files.push(newFile)

            uploadedFiles.push(newFile);
        }
        await user.save()

        return res.status(200).json({
            message: "Upload Successful"
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}
module.exports.delete = async (req, res) => {
    try {
        const fileId = req.body.id;
        const file = await File.findById(fileId)
        if (!file) {
            return res.status(404).json({
                message: 'File not found',
            });
        }
        if (file.user != req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized to delete',
            });
        }

        // Delete the file by its ID
        await File.findByIdAndDelete(fileId);

        // Find the user by their ID
        const userId = req.user.id;
        const user = await User.findById(userId);

        // Update the user's files array by filtering out the deleted file ID
        user.files = user.files.filter((fileId) => fileId.toString() !== fileId);
        console.log(fileId);
        // Save the updated user to the database
        await user.save();
        console.log(user.files[0].toString())

        return res.status(200).json({
            message: 'File deleted successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};