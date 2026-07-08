const mongoose = require('mongoose');

let connectionPromise = null;

const connectMongoDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is required');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000
        }).then(() => {
            console.log('Connected to MongoDB database:', mongoose.connection.name);
            return mongoose.connection;
        }).catch((error) => {
            connectionPromise = null;
            throw error;
        });
    }

    return connectionPromise;
};

module.exports = connectMongoDB;
