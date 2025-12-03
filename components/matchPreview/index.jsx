import styles from "./style.module.css";

function getRarityEmoji(rarityText) {
    if (!rarityText) return "";

    const value = String(rarityText).trim();

    switch (value) {
        case "One Diamond":
            return "◆";
        case "Two Diamond":
            return "◆◆";
        case "Three Diamond":
            return "◆◆◆";
        case "Four Diamond":
            return "◆◆◆◆";
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
            return value;
    }
}

export default function MatchPreview({ match }) {
    const { username, friendCode, get = [], give = [] } = match;

    function renderCardUI(card) {
        const rarityEmoji = getRarityEmoji(card.rarityText);

        return (
            <div key={card.id} className={styles.tradeCardBox}>
                <img
                    src={card.image}
                    alt={card.name}
                    className={styles.cardImage}
                />
                <div className={styles.cardText}>
                    <span className={styles.cardName}>{card.name}</span>
                    <div>
                        <span className={styles.cardId}>{card.id}</span>
                        <span className={styles.cardRarity}>{rarityEmoji}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.preview}>
            <div>
                <p className={styles.username}>
                    <strong>{username}</strong>
                </p>
                {friendCode && (
                    <p className={styles.friendCode}>
                        Friend Code: <br />
                        {friendCode}
                    </p>
                )}
            </div>

            <div className={styles.rows}>
                <div className={styles.row}>
                    <p>You receive</p>
                    <div className={styles.cardUI}>
                        {get.map(renderCardUI)}
                    </div>
                </div>

                <div className={styles.row}>
                    <p>You give</p>
                    <div className={styles.cardUI}>
                        {give.map(renderCardUI)}
                    </div>
                </div>
            </div>
        </div>
    );
}
