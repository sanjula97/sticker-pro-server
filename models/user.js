import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    { 
        collection: 'users'
    }
);

const model = mongoose.model('userSchema', userSchema);
module.exports = model