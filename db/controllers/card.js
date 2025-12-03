import User from "../models/user";
import Card from "../models/card";
import { normalizeId, dbConnect } from "./util";

export async function getUserCards(userId) {
    await dbConnect();
    const user = await User.findById(userId).lean();
    if (!user) return null;
    return {
        canTradeCards: user.canTradeCards,
        wantCards: user.wantCards,
    };
}

export async function addCanTrade(userId, cardId) {
    await dbConnect();
    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { canTradeCards: cardId } },
        { new: true }
    );
    if (!user) return null;
    return normalizeId(user);
}

export async function addWant(userId, cardId) {
    await dbConnect();
    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wantCards: cardId } },
        { new: true }
    );
    if (!user) return null;
    return normalizeId(user);
}

export async function removeCanTrade(userId, cardId) {
    await dbConnect();
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { canTradeCards: cardId } },
        { new: true }
    );
    if (!user) return null;
    return normalizeId(user);
}

export async function removeWant(userId, cardId) {
    await dbConnect();
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { wantCards: cardId } },
        { new: true }
    );
    if (!user) return null;
    return normalizeId(user);
}

export async function getPokeLibraryCards() {
    await dbConnect();
    const cards = await Card.find({}).lean();
    return cards;
}

export async function savePokeLibraryCards(cards) {
    await dbConnect();
    await Card.deleteMany({});
    await Card.insertMany(cards);
    const saved = await Card.find({}).lean();
    return saved;
}

export async function getCardsByIds(cardIds) {
    await dbConnect();
    const cards = await Card.find({ id: { $in: cardIds } })
        .select("id name localId image rarityText -_id")
        .lean();

    return cards;
}
