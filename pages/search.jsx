import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import sessionOptions from "../config/session";
import Header from "../components/header";
import CardList from "../components/cardList";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Search.module.css";

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const { user } = req.session;
        const props = {};
        if (user) {
            props.user = req.session.user;
        }
        props.isLoggedIn = !!user;
        return { props };
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
export default function Search(props) {
    const [allCards, setAllCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [fetching, setFetching] = useState(true);
    const [userCanTradeCards, setUserCanTradeCards] = useState([]);
    const [userWantCards, setUserWantCards] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
        async function fetchAllCards() {
            setFetching(true);
            try {
                const res = await fetch("/api/cards/all");
                const data = await res.json();

                const cardsWithEmoji = data.map((card) => ({
                    ...card,
                    rarity: getRarityEmoji(card.rarityText),
                }));

                setAllCards(cardsWithEmoji);
                setFilteredCards(cardsWithEmoji);
            } catch (error) {
                console.error("Error:", error);
            }
            setFetching(false);
        }

        fetchAllCards();
    }, []);

    useEffect(() => {
        if (props.isLoggedIn) {
            fetchUserCards();
        }
    }, [props.isLoggedIn]);

    async function fetchUserCards() {
        try {
            const res = await fetch("/api/user/cards");
            const data = await res.json();
            setUserCanTradeCards(data.canTradeCards);
            setUserWantCards(data.wantCards);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    //search feature
    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredCards(allCards);
        } else {
            const filtered = allCards.filter((card) =>
                card.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredCards(filtered);
        }
    }, [searchText, allCards]);

    async function handleAddCanTrade(cardId) {
        try {
            const res = await fetch("/api/cards/can-trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardId }),
            });
            setUserCanTradeCards([...userCanTradeCards, cardId]);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleRemoveCanTrade(cardId) {
        try {
            const res = await fetch("/api/cards/can-trade", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardId }),
            });
            setUserCanTradeCards(
                userCanTradeCards.filter((id) => id !== cardId)
            );
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleAddWant(cardId) {
        try {
            const res = await fetch("/api/cards/want", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardId }),
            });
            setUserWantCards([...userWantCards, cardId]);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleRemoveWant(cardId) {
        try {
            const res = await fetch("/api/cards/want", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardId }),
            });
            setUserWantCards(userWantCards.filter((id) => id !== cardId));
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <Head>
                <title>Pokemon Card Search</title>
                <meta
                    name="description"
                    content="Search and add Pokemon cards"
                />
            </Head>

            <Header isLoggedIn={props.isLoggedIn} />
            <main>
                <h1 className={styles.title}>Pokemon Cards Library</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Search by Pokemon name:</label>
                    <input
                        ref={inputRef}
                        type="text"
                        name="card-search"
                        value={searchText}
                        autoFocus={true}
                        placeholder="try Suicune"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>
                {fetching ? (
                    <Loading />
                ) : filteredCards?.length ? (
                    <>
                        <CardList
                            cards={filteredCards}
                            userCanTradeCards={userCanTradeCards}
                            userWantCards={userWantCards}
                            onAddCanTrade={handleAddCanTrade}
                            onRemoveCanTrade={handleRemoveCanTrade}
                            onAddWant={handleAddWant}
                            onRemoveWant={handleRemoveWant}
                            showButtons={props.isLoggedIn}
                        />
                    </>
                ) : (
                    <NoResults searchText={searchText} />
                )}
            </main>
        </>
    );
}

function Loading() {
    return (
        <span className={styles.loading}>
            Loading, cards will be ready soon...⌛
        </span>
    );
}

function NoResults({ searchText }) {
    return (
        <div className={styles.noResults}>
            <p>
                <strong>
                    {searchText
                        ? `No cards found for ${searchText}`
                        : "Something is wrong..."}
                </strong>
            </p>
        </div>
    );
}
