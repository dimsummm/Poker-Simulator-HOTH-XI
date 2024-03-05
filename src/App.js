import './App.css'; 
import React, { useState } from 'react';
import { createDeck, shuffleDeck} from './deckCreationUtils';
import handStrengths from './handStrengths'; 

function App() {
  const [cards, setCards] = useState([]);
  const [potSize, setPotSize] = useState(0);
  const [opponentBet, setOpponentBet] = useState(0);
  const [userAction, setUserAction] = useState('');
  const [equity, setEquity] = useState(null);
  const [potOdds, setPotOdds] = useState(null);
  const [decisionMessage, setDecisionMessage] = useState('');
  const deck = createDeck();

  const dealTwoCards = () => {
    shuffleDeck(deck);
    const dealtCards = deck.splice(0,2);
    setCards(dealtCards);
    setOpponentBet(Math.floor(Math.random() * 10) + 5);
    setEquity(calculateEquity(dealtCards));
    setUserAction(''); 
  };

  const calculateEquity = (dealtCards) => {
    if (dealtCards.length < 2) return null;
    
    // Get details for each card
    const card1Details = getCardDetails(dealtCards[0]);
    const card2Details = getCardDetails(dealtCards[1]);
  
    // Sort the cards by rank to ensure consistent key generation
    const sortedCards = [card1Details, card2Details].sort((a, b) => rankValues[b.rank] - rankValues[a.rank]);
  
    // Determine if the cards are suited or offsuit
    const suited = sortedCards[0].suit === sortedCards[1].suit ? 's' : 'o';
    
    // Create a key for looking up the hand strength
    const key = `${getRankChar(sortedCards[0].rank)}${getRankChar(sortedCards[1].rank)}${suited}`;
  
    // Look up the equity value in the handStrengths object
    return handStrengths[key] || null;
  };

    const getCardDetails = (cardString) => {
    // Split the card string into its rank and suit parts
    const parts = cardString.split('_of_');
    const rank = parts[0]; // The first part is the rank (e.g., '2', 'Ace')
    const suit = parts[1]; // The second part is the suit (e.g., 'Clubs', 'Spades')
    return { rank, suit };
  };

  // Function to map rank strings to values for sorting
  const rankValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'Jack': 11, 'Queen': 12, 'King': 13, 'Ace': 14
  };

  // Helper function to get the single character rank representation
  const getRankChar = (rank) => {
    if (rank === '10') return 'T'; // '10' is represented as 'T'
    return rank[0]; // Use the first character of the rank
  };
  
  const calculatePotOdds = () => {
    const totalPot = potSize + opponentBet;
    if (totalPot > 0) {
      const odds = opponentBet / totalPot; // Keep as decimal
      setPotOdds(odds.toFixed(2)); // Format for readability but keep as decimal for comparison
    }
  };

  const evaluateDecision = (action) => {
    // Convert equity to a decimal for comparison
    const potOddsDecimal = parseFloat(potOdds);
  
    let message = '';
  
    if (action === 'call') {
      // Correct to call if equity > pot odds
      message = equity > potOddsDecimal ? 'Correct choice' : 'Wrong choice';
    } else if (action === 'fold') {
      // Correct to fold if equity is less than or equal to pot odds
      message = equity <= potOddsDecimal ? 'Correct choice' : 'Wrong choice';
    }
  
    setDecisionMessage(message);
  };

  const handleUserAction = (action) => {
    setUserAction(action);
    // Ensure pot odds are up-to-date before evaluating the decision
    calculatePotOdds();
    if (['call', 'fold'].includes(action)) {
      // Delaying evaluation to ensure state updates have been applied
      setTimeout(() => evaluateDecision(action), 0);
    }
  };

  const callBlinds = (action) => {
    setPotSize(action + opponentBet);
  };

  return (
    <div className="App">
      <h1>Poker Hand Simulator</h1>
      <p>Please use this at your own risk, do not rely on this program for financial advice. If you or a loved one is struggling with a gambling problem, please call <a href="tel:+18006624357">+1-800-662-4357</a>.
</p>
      <p>Pot: ${potSize}</p>
      <button onClick={dealTwoCards}>Deal Cards</button>
      {opponentBet > 5 && (
        <div>
          <button onClick={() => callBlinds(5)}>Play for $5</button>
          {potSize >= 5 && (
            <div>
              <p>Opponent's Bet: ${opponentBet}</p>
              <button onClick={() => handleUserAction('call')}>Call</button>
              <button onClick={() => handleUserAction('fold')}>Fold</button>
              {decisionMessage && <p>{decisionMessage}</p>}
            </div>
          )}
        </div>
      )}
      <div id="card-container">
        {cards.map((card, index) => (
          <img key={index} src={`cards/${card}.png`} alt={card} style={{width: '100px', margin: '10px'}} />
        ))}
      </div>
    </div>
  );
}

export default App;