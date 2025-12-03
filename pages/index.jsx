import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import styles from "../styles/Home.module.css";
import MatchList from "../components/matchList";

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

const placeholderMatches = [
    {
        username: "John Doe",
        friendCode: "0000-0000-0000-0000",
        get: [
            {
                id: "A1-001",
                name: "Bulbasaur",
                image: "https://assets.tcgdex.net/en/tcgp/A1/001/low.jpg",
                rarityText: "One Diamond",
            },
        ],
        give: [
            {
                id: "A1-005",
                name: "Caterpie",
                image: "https://assets.tcgdex.net/en/tcgp/A1/005/low.jpg",
                rarityText: "One Diamond",
            },
        ],
    },
    {
        username: "Jane Doe",
        friendCode: "1111-2222-3333-4444",
        get: [
            {
                id: "A1-002",
                name: "Ivysaur",
                image: "https://assets.tcgdex.net/en/tcgp/A1/002/low.jpg",
                rarityText: "Two Diamond",
            },
        ],
        give: [
            {
                id: "A1-012",
                name: "Gloom",
                image: "https://assets.tcgdex.net/en/tcgp/A1/012/low.jpg",
                rarityText: "Two Diamond",
            },
        ],
    },
];

export default function Home(props) {
    const { isLoggedIn } = props;

    return (
        <>
            <Head>
                <title>Matchmaker</title>
            </Head>

            <Header
                isLoggedIn={props.isLoggedIn}
            />

            <main className={styles.homepage}>
                <h1>Welcome to Pokemon Pocket Matchmaker</h1>

                {!isLoggedIn ? (
                    <p>Please login/signup to use this app.</p>
                ) : (
                    <>
                        <p>
                            This is what the matchmaker feature should look like
                            (currently a placeholder).
                        </p>
                        <MatchList matches={placeholderMatches} />
                    </>
                )}
            </main>
        </>
    );
}
