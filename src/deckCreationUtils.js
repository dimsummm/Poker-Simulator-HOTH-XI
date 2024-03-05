export function createDeck() { //Creates deck
    const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']; //Sets the possible card suits
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']; //Sets the possible card values
    const deck = suits.flatMap(suit => ranks.map(rank => `${rank}_of_${suit}`)); //Converts a combinations of suit and value to a image_id
    return deck;
  }
  
export function shuffleDeck(deck) { //Shuffles Deck
    for (let i = deck.length - 1; i > 0; i--) { //Loops through every card in deck
      const j = Math.floor(Math.random() * (i + 1)); //Sets a random location to send a card to
      [deck[i], deck[j]] = [deck[j], deck[i]]; //Sends each card 'i' to its random location 'j'
    }
  }