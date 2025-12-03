import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session";
import db from "../../../db";

export default withIronSessionApiRoute(async function handler(req, res) {
    if (req.session.user) {
        switch (req.method) {
            case "POST":
                try {
                    const addCard = await db.card.addWant(
                        req.session.user.id,
                        req.body.cardId
                    );
                    if (addCard == null) {
                        req.session.destroy();
                        return res.status(401).end();
                    }
                    return res.status(200).json(addCard);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            case "DELETE":
                try {
                    const removeCard = await db.card.removeWant(
                        req.session.user.id,
                        req.body.cardId
                    );
                    if (removeCard == null) {
                        req.session.destroy();
                        return res.status(401).end();
                    }
                    return res.status(200).json(removeCard);
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
