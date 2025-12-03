import MatchPreview from "../matchPreview";
import styles from "./style.module.css";

export default function MatchList({ matches }) {
    return (
        <div className={styles.list}>
            {matches.map((match, index) => (
                <MatchPreview key={index} match={match} />
            ))}
        </div>
    );
}
