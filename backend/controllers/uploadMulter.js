import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import config from '../config/dotenv.js';

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'uploads/');
    },
    fileName(req,file,cb){
        let extension = file.originalname.split('.');
        let encode = Date.now()+'.'+extension[extension.length-1];
        cb(null,encode);
    }
})
const upload = multer({storage});
const uploadImage = (req,res) => {
    res.send(`${req.file.location}`);
}
const uploadImages = (req, res)=>{
    console.log(req.files);
}
//config aws
aws.config.update({
    accessKeyId:config.ACCESS_KEY_ID_AMAZONA,
    secretAccessKey:config.SECRET_ACCESS_KEY_AMAZONA
})
const s3 = new aws.S3();
const storageS3 = multerS3({
    s3,
    bucket:'dinhbao-ecommerce-app',
    acl:'public-read',
    contentType:multerS3.AUTO_CONTENT_TYPE,
    key(req,file,cb){
        cb(null,Date.now().toString());
    },
});
const uploadS3 = multer({storage:storageS3});

export default {
    upload:upload,
    uploadS3:uploadS3,
    uploadImage:uploadImage,
    uploadImages:uploadImages
}