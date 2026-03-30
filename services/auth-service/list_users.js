const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://Kavin1221:Kavin%401221@cluster0.plkmhy9.mongodb.net/healthcare_db';

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
});
const User = mongoose.model('User', UserSchema);

async function listUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        const users = await User.find({}, 'fullName email role');
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
