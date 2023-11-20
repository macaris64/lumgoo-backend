import mongoose, {Document, Schema} from "mongoose";
import bcrypt from 'bcrypt';

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    fullname: string,
    createdAt: Date,
    modifiedAt: Date,
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema <IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
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

userSchema.pre<IUser>('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
