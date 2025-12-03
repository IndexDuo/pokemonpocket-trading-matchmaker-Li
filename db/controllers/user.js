import User from "../models/user";
import { normalizeId, dbConnect } from "./util";

export async function create(username, password, friendCode) {
    if (!(username && password && friendCode))
        throw new Error("Must include username, password, and fiend code");

    await dbConnect();

    const user = await User.create({
        username,
        password,
        friendCode,
        canTradeCards: [],
        wantCards: [],
    });

    if (!user) throw new Error("Error inserting User");

    return normalizeId(user);
}
