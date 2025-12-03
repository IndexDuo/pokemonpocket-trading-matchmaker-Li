import styles from "./style.module.css";

export default function CardPreview({
    card,
    isInCanTrade,
    isInWant,
    onAddCanTrade,
    onRemoveCanTrade,
    onAddWant,
    onRemoveWant,
    showButtons = true,
}) {
    const { id, name, image, rarity } = card;

    async function handleCanTradeClick() {
        if (isInCanTrade) {
            await onRemoveCanTrade(id);
        } else {
            await onAddCanTrade(id);
        }
    }

    async function handleWantClick() {
        if (isInWant) {
            await onRemoveWant(id);
        } else {
            await onAddWant(id);
        }
    }

    return (
        <div className={styles.preview}>
            <img src={image} alt={name} className={styles.cardImage} />
            <div className={styles.info}>
                <p>
                    <strong>{name}</strong>
                </p>
                <p className={styles.cardId}>{id}</p>
                {rarity && <p>Rarity {rarity}</p>}

                {showButtons && (
                    <div className={styles.buttons}>
                        <button
                            onClick={handleCanTradeClick}
                            className={
                                isInCanTrade ? styles.removeBtn : styles.addBtn
                            }
                        >
                            {isInCanTrade ? "- Can Trade" : "+ Can Trade"}
                        </button>
                        <button
                            onClick={handleWantClick}
                            className={
                                isInWant ? styles.removeBtn : styles.addBtn
                            }
                        >
                            {isInWant ? "- Want" : "+ Want"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
