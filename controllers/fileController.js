const User = require('../models/user')
const File = require('../models/file')
const fs = require('fs');
const path = require('path');


module.exports.upload = async (req, res) => {
    try {
        // console.log(req.files);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'No files were uploaded.',
            });
        }
        const user = await User.findById(req.user._id)
        const respFiles=[]
        for (const file of req.files) {
            const newFile = await File.create({
                user: user,
                name: file.filename,
                actualName: file.originalname,
            });
            user.files.push(newFile)
            respFiles.push(newFile.id)
        }
        await user.save()
        return res.status(200).json({
            message: "Upload Successful",
            files: respFiles
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}
//To store files against default user
const getDefaultUser = async () => {
    const userName = process.env.DEFAULT_USERNAME || 'def123user'
    let user = await User.findOne({ name: userName })
    if (!user) {
        user = await User.create({
            email: process.env.DEFAULT_EMAIL || 'def1emaildebajyoti23user',
            name: userName,
            password: process.env.DEFAULT_PASSWORD || 'defpassdebajyotiword123user'
        })
    }
    return user
}

module.exports.uploadNoAuth = async (req, res) => {
    try {
        // console.log(req.files);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'No files were uploaded.',
            });
        }
        const user = await getDefaultUser()
        const respFiles=[]
        for (const file of req.files) {
            const newFile = await File.create({
                user: user,
                name: file.filename,
                actualName: file.originalname,
            });
            console.log(user);
            user.files.push(newFile)
            respFiles.push(newFile.id)
        }
        await user.save()

        return res.status(200).json({
            message: "Upload Successful",
            files: respFiles
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
        user.files = user.files.filter((fileid) => fileid.toString() !== fileId);
        // Save the updated user to the database
        await user.save();

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

module.exports.getFileInfoById = async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await File.findById(fileId).populate({
            path: 'user',
            select: 'name'

        });

        if (!file) {
            return res.status(404).json({
                message: 'File not found',
            });
        }

        return res.status(200).json({
            message: file,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

module.exports.getFileInfoByIdMulti = async (req, res) => {
    try {
        const files = req.body.files;
        // console.log(req.body);
        const fileDetails = [];

        for (const fileId of files) { // Assuming files contain file IDs
            let file = await File.findById(fileId);
            if (file) {
                fileDetails.push(file);
            } else {
                // Handle case when file with ID doesn't exist
                console.warn(`File with ID ${fileId} not found`);
                fileDetails.push(null);
            }
        }

        return res.status(200).json({
            fileDetails: fileDetails // Sending back the retrieved file details
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};


module.exports.downloadById = async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(process.cwd(), '/uploads/', file.name);

        // Check if the file exists in the specified path
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not available in folder' });
        }

        return res.status(200).download(filePath, file.actualName);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
