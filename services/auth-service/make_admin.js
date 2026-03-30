const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://Kavin1221:Kavin%401221@cluster0.plkmhy9.mongodb.net/healthcare_db';

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
});
const User = mongoose.model('User', UserSchema);

async function makeAdmin(email) {
    try {
        await mongoose.connect(MONGO_URI);
        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
        if (user) {
            console.log(`User ${email} is now an admin!`);
        } else {
            console.log(`User ${email} not found.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email address: node make_admin.js user@example.com');
} else {
    makeAdmin(email);
}
