import mongoose from 'mongoose';

const connectMongo = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected mongoose successfully');
    } catch(err){
        console.log('Connect mongoose failed: ', err);
    }
};

export default connectMongo;