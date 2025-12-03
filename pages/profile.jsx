//pages\profile.jsx

import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Favorites.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import CardList from "../components/cardList";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;

        const userCards = await db.card.getUserCards(user.id);

        if (userCards === null) {
            req.session.destroy();
            return {
                redirect: {
                    destination: "/login",
                    permanent: false,
                },
            };
        }

        const allCardIds = [...userCards.canTradeCards, ...userCards.wantCards];
        const cardDetails = await db.card.getCardsByIds(allCardIds);

        return {
            props: {
                user: req.session.user,
                isLoggedIn: true,
                userCanTradeCards: userCards.canTradeCards,
                userWantCards: userCards.wantCards,
                cardDetails: cardDetails,
            },
        };
    },
    sessionOptions
);

function getRarityEmoji(rarityText) {
    switch (rarityText) {
        case "One Diamond":
            return "🔶";
        case "Two Diamond":
            return "🔶🔶";
        case "Three Diamond":
            return "🔶🔶🔶";
        case "Four Diamond":
            return "🔶🔶🔶🔶";
        case "One Star":
            return "⭐";
        case "Two Star":
            return "⭐⭐";
        case "Three Star":
            return "⭐⭐⭐";
        case "One Shiny":
            return "✨";
        case "Two Shiny":
            return "✨✨";
        case "Crown":
            return "👑";
        default:
            return rarityText;
    }
}

export default function Profile(props) {
    const { cardDetails, userCanTradeCards, userWantCards } = props;

    const cardsWithEmoji = cardDetails.map((card) => ({
        ...card,
        rarity: getRarityEmoji(card.rarityText),
    }));

    const canTradeCardsList = cardsWithEmoji.filter((card) =>
        userCanTradeCards.includes(card.id)
    );

    const wantCardsList = cardsWithEmoji.filter((card) =>
        userWantCards.includes(card.id)
    );

    const hasCards = canTradeCardsList.length > 0 || wantCardsList.length > 0;

    return (
        <>
            <Head>
                <title>Matchmaker</title>
            </Head>
            <Header isLoggedIn={props.isLoggedIn} />

            <main>
                <h1 className={styles.title}>My Card Collection</h1>
                {!hasCards ? (
                    <NoCardsText />
                ) : (
                    <>
                        {canTradeCardsList.length > 0 && (
                            <section>
                                <h2
                                    style={{
                                        textAlign: "center",
                                        marginTop: "5px",
                                    }}
                                >
                                    Cards I Can Trade (
                                    {canTradeCardsList.length})
                                </h2>
                                <CardList
                                    cards={canTradeCardsList}
                                    userCanTradeCards={userCanTradeCards}
                                    userWantCards={userWantCards}
                                    onAddCanTrade={() => {}}
                                    onRemoveCanTrade={async (cardId) => {
                                        await fetch("/api/cards/can-trade", {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({ cardId }),
                                        });
                                        window.location.reload();
                                    }}
                                    onAddWant={() => {}}
                                    onRemoveWant={async (cardId) => {
                                        await fetch("/api/cards/want", {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({ cardId }),
                                        });
                                        window.location.reload();
                                    }}
                                    showButtons={true}
                                />
                            </section>
                        )}

                        {wantCardsList.length > 0 && (
                            <section>
                                <h2
                                    style={{
                                        textAlign: "center",
                                        marginTop: "15px",
                                    }}
                                >
                                    Cards I Want ({wantCardsList.length})
                                </h2>
                                <CardList
                                    cards={wantCardsList}
                                    userCanTradeCards={userCanTradeCards}
                                    userWantCards={userWantCards}
                                    onAddCanTrade={async (cardId) => {
                                        await fetch("/api/cards/can-trade", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({ cardId }),
                                        });
                                        window.location.reload();
                                    }}
                                    onRemoveCanTrade={async (cardId) => {
                                        await fetch("/api/cards/can-trade", {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({ cardId }),
                                        });
                                        window.location.reload();
                                    }}
                                    onAddWant={() => {}}
                                    onRemoveWant={async (cardId) => {
                                        await fetch("/api/cards/want", {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({ cardId }),
                                        });
                                        window.location.reload();
                                    }}
                                    showButtons={true}
                                />
                            </section>
                        )}
                    </>
                )}
            </main>
        </>
    );
}

function NoCardsText() {
    return (
        <div className={styles.noBooks}>
            <p>
                <strong>
                    You haven't added any cards to your collection yet.
                </strong>
            </p>
            <p>
                Why don't you <Link href="/search">go to search</Link> and add
                some?
            </p>
        </div>
    );
}
