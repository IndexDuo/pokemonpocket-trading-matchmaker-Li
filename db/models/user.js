import { Schema, model, models } from "mongoose";
// import bookSchema from "./book";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 200,
    },
    // favoriteBooks: [bookSchema],
    friendCode: {
        type: String,
        required: true,
    },
    canTradeCards: [
        {
            type: String,
            trim: true,
        },
    ],
    wantCards: [
        {
            type: String,
            trim: true,
        },
    ],
});

// hashes the password before it's stored in mongo
UserSchema.pre("save", async function (next) {
    if (this.isNew) this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default models.User || model("User", UserSchema);
