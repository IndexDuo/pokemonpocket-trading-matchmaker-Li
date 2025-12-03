import CardPreview from "../cardPreview"
import styles from './style.module.css'

export default function CardList({ cards, userCanTradeCards = [], userWantCards = [], onAddCanTrade, onRemoveCanTrade, onAddWant, onRemoveWant, showButtons = true }) {
  return (
    <div className={styles.list}>
      {cards.map(card => (
        <CardPreview 
          key={card.id}
          card={card}
          isInCanTrade={userCanTradeCards.includes(card.id)}
          isInWant={userWantCards.includes(card.id)}
          onAddCanTrade={onAddCanTrade}
          onRemoveCanTrade={onRemoveCanTrade}
          onAddWant={onAddWant}
          onRemoveWant={onRemoveWant}
          showButtons={showButtons}
        />
      ))}
    </div>
  )
}