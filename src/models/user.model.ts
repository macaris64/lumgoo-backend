import mongoose, {Document, Schema} from "mongoose";

const emailValidator = (email: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    fullname: string,
    createdAt: Date,
    modifiedAt: Date
}

const userSchema: Schema <IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [emailValidator, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [5, 'Password must be at least 5 characters long']
    },
    fullname: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
