import dotenv from 'dotenv';
dotenv.config();
export default {
    PORT:process.env.PORT || 2000,
    MONGODB_URL:process.env.MONGODB_URL || 'mongodb://localhost:27017/amazona',
    JWT_SECRET:process.env.JWT_SECRET || 'somethingSecret',
    PAYPAL_CLIENT_ID:process.env.PAYPAL_CLIENT_ID || 'sb',
    ACCESS_KEY_ID_AMAZONA:process.env.ACCESS_KEY_ID_AMAZONA || 'accessKeyId',
    SECRET_ACCESS_KEY_AMAZONA:process.env.SECRET_ACCESS_KEY_AMAZONA || 'secretAccessKey'
}