import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session";
import db from "../../../db";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAllCards() {
    const series = await fetch("https://api.tcgdex.net/v2/en/series/tcgp");
    const seriesData = await series.json();
    const setsTradable = seriesData.sets.slice(1); //promo cards cant be traded

    const allCards = [];

    for (const set of setsTradable) {
        const set = await fetch(`https://api.tcgdex.net/v2/en/sets/${set.id}`);
        const setData = await set.json();

        for (const card of setData.cards) {
            try {
                const cardDetail1 = await fetch(
                    `https://api.tcgdex.net/v2/en/sets/${set.id}/${card.localId}`
                );

                const cardDetail2 = await cardDetail1.json();

                const rarityText =
                    cardDetail2.rarity && cardDetail2.rarity.trim() !== ""
                        ? cardDetail2.rarity
                        : "Unknown";

                allCards.push({
                    id: cardDetail2.id,
                    name: cardDetail2.name,
                    localId: cardDetail2.localId,
                    image: `${cardDetail2.image}/low.jpg`,
                    rarityText,
                });
            } catch (err) {
                console.error(err);

                allCards.push({
                    id: card.id,
                    name: card.name,
                    localId: card.localId,
                    image: `${card.image}/low.jpg`,
                    rarityText: "Unknown",
                });
            }
        }
    }

    return allCards;
}

export default withIronSessionApiRoute(async function handler(req, res) {
    switch (req.method) {
        case "GET":
            try {
                let cards = await db.card.getPokeLibraryCards();

                if (cards && cards.length > 0) {
                    return res.status(200).json(cards);
                }
                cards = await getAllCards();
                await db.card.savePokeLibraryCards(cards);

                return res.status(200).json(cards);
            } catch (error) {
                console.error(error);
                return res.status(400).json({ error: error.message });
            }

        default:
            return res.status(404).end();
    }
}, sessionOptions);
