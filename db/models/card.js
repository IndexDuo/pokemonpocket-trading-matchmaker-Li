import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    localId: { type: String, required: true },
    image: { type: String, required: true },
    rarityText: { type: String, required: true },
});

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
