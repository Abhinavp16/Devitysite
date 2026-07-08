const mongoose = require('mongoose');

const connectMongoDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is required');
    }

    await mongoose.connect(uri);
    console.log('📊 Connected to MongoDB database:', mongoose.connection.name);
};

module.exports = connectMongoDB;
