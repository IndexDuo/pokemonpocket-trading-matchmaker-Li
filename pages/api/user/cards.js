import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session";
import db from "../../../db";

export default withIronSessionApiRoute(async function handler(req, res) {
    if (req.session.user) {
        switch (req.method) {
            case "GET":
                try {
                    const userCards = await db.card.getUserCards(
                        req.session.user.id
                    );
                    if (userCards == null) {
                        req.session.destroy();
                        return res.status(401).end();
                    }
                    return res.status(200).json(userCards);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            default:
                return res.status(404).end();
        }
    } else {
        return res.status(401).end();
    }
}, sessionOptions);
