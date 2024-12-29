import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Crimson Text', serif;
    background: #000;
    color: #fff;
    height: 100vh;
    overflow: hidden;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { 
    transform: scale(2);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  padding: 0;
  margin: 0;
`;

const GameScreen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  overflow-y: auto;
  cursor: pointer;
`;

const IntroScreen = styled(GameScreen)`
  justify-content: center;
  text-align: center;
`;

const TypewriterText = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #e0d4b4;
  margin-left: 5px;
  animation: ${blink} 1s infinite;
  vertical-align: middle;
`;

const TitleText = styled.div`
  font-family: 'Cinzel Decorative', cursive;
  color: #ffd700;
  font-size: 4rem;
  font-weight: 900;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin-bottom: 2rem;
  animation: ${scaleIn} 2s ease-out;
  text-align: center;
  line-height: 1.2;
`;

const SubTitle = styled.div`
  font-family: 'Cinzel Decorative', cursive;
  color: #ffd700;
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 1.5s;
`;

const StyledButton = styled.button`
  background: transparent;
  border: 2px solid #ffd700;
  color: #ffd700;
  padding: 12px 24px;
  margin: 10px;
  cursor: pointer;
  font-family: 'Crimson Text', serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  opacity: ${props => props.fadeIn ? 0 : 1};
  animation: ${props => props.fadeIn ? fadeIn : 'none'} 1s ease-out forwards;
  animation-delay: ${props => props.fadeIn ? '2s' : '0s'};

  &:hover {
    background-color: #ffd700;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TutorialScreen = styled.div`
  padding: 30px;
  color: #e0d4b4;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  margin-top: 20px;
`;

const Inventory = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid #e0d4b4;
  color: #e0d4b4;
  font-style: italic;
`;

const gameStates = {
  intro: {
    text: "Welcome to\n\nTEMPLE OF THE GOLDEN SCARAB\n\nA Text Adventure",
    choices: [
      { text: "See Tutorial", nextState: "tutorial" },
      { text: "Start Game", nextState: "start" }
    ]
  },
  tutorial: {
    text: " HOW TO PLAY\n\n" +
          "1. Navigate through the temple by selecting available choices.\n" +
          "2. You can carry up to 5 items in your inventory.\n" +
          "3. Some items may be crucial for your survival.\n" +
          "4. Your goal is to find and escape with the Golden Scarab.\n" +
          "5. Choose wisely - danger lurks in the shadows.",
    choices: [
      { text: "Begin Adventure", nextState: "start" }
    ]
  },
  start: {
    text: " You find yourself in the main chamber of an ancient temple. The darkness is absolute, broken only by the beam of your flashlight. The chamber branches into three paths: left, right, and straight ahead. Your mission is to find and escape with the invaluable Golden Scarab, though survival alone would be considered a success.",
    choices: [
      { text: "Take the left path", nextState: "leftPath" },
      { text: "Take the right path", nextState: "rightPath" },
      { text: "Go straight ahead", nextState: "centerPath" }
    ],
    onEnter: (setInventory) => {
      setInventory(['Flashlight', 'Canteen of Water']);
    }
  },
  dropItem: {
    text: " Your inventory is full. Which item would you like to drop?",
    getChoices: (inventory, pendingItem, previousState) => {
      return [
        ...inventory.map(item => ({
          text: `Drop ${item}`,
          nextState: previousState,
          action: 'replaceItem',
          dropItem: item,
          addItem: pendingItem
        })),
        { text: "Keep current items", nextState: previousState }
      ];
    }
  },
  leftPath: {
    text: " You enter a maze of sarcophagi. The beam of your flashlight reveals ancient coffins arranged in a confusing pattern. In the distance, you spot something glinting - a Book of Spells. Suddenly, you hear the sound of bandages rustling...",
    choices: [
      { text: "Try to grab the Book of Spells", nextState: "mummyEncounter" },
      { text: "Return to main chamber", nextState: "start" }
    ]
  },
  mummyEncounter: {
    text: " As you approach the Book of Spells, a mummy emerges from its sarcophagus! Without a weapon, you're defenseless against this ancient horror! \n\n*** YOU ARE DEAD ***",
    choices: [
      { text: "Play Again", nextState: "start" },
      { text: "Return to Title Screen", nextState: "intro" }
    ],
    onEnter: (setInventory) => {
      setInventory([]);
    }
  },
  rightPath: {
    text: " You come across a sealed chamber. The massive stone door has an ancient lock mechanism. You'll need a specific key to open it.",
    choices: [
      { text: "Return to main chamber", nextState: "start" }
    ]
  },
  centerPath: {
    text: " Following a dark passage, you enter a small chamber. Your flashlight beam reveals a mounted torch, various pieces of pottery (some broken), and a couple of ancient paintings on the walls.",
    choices: [
      { text: "Inspect the torch", nextState: "inspectTorch" },
      { text: "Examine the pottery", nextState: "inspectPottery" },
      { text: "Study the paintings", nextState: "inspectPaintings" },
      { text: "Return to main chamber", nextState: "start" }
    ]
  },
  inspectTorch: {
    text: " The torch appears to be in good condition, still coated with flammable resin.",
    choices: [
      { text: "Take the torch", nextState: "centerPath", action: "addItem", item: "Torch" },
      { text: "Leave it", nextState: "centerPath" }
    ]
  },
  inspectPottery: {
    text: " The pottery is mostly broken, with nothing of interest among the shards.",
    choices: [
      { text: "Go back", nextState: "centerPath" }
    ]
  },
  inspectPaintings: {
    text: " As you examine the paintings closely, your hand brushes against one of them, causing it to shift slightly. There's a secret passage behind it!",
    choices: [
      { text: "Enter the secret passage", nextState: "darkPassage" },
      { text: "Return to chamber", nextState: "centerPath" }
    ]
  },
  darkPassage: {
    text: (inventory) => {
      if (!inventory.includes('Flashlight')) {
        return " Your flashlight has stopped working. The passage ahead is pitch black.";
      }
      return " You follow the dark passage, your flashlight illuminating the way.";
    },
    choices: (inventory) => {
      const choices = [];
      if (inventory.includes('Torch')) {
        choices.push({ text: "Use the torch", nextState: "treasureChamber", action: "useItem", item: "Torch" });
      }
      choices.push({ text: "Continue in darkness", nextState: "darkPassageSlow" });
      return choices;
    }
  },
  darkPassageSlow: {
    text: " You slowly make your way through the darkness, feeling along the walls. It takes much longer, but eventually you reach the other side.",
    choices: [
      { text: "Continue", nextState: "treasureChamber" }
    ]
  },
  treasureChamber: {
    text: " You enter a vast chamber filled with piles of gold, jewels, and ancient artifacts. Among the treasures, you notice a small bag of coins and an unusual symbol that looks insertable somewhere. There's also what appears to be a backpack that could help carry more items.",
    choices: [
      { text: "Inspect the bag of coins", nextState: "inspectCoins" },
      { text: "Examine the symbol", nextState: "inspectSymbol" },
      { text: "Check the backpack", nextState: "inspectBackpack" },
      { text: "Take the right exit", nextState: "exitPath" },
      { text: "Take the left exit", nextState: "keyRoom" },
      { text: "Go back to the passage", nextState: "darkPassage" }
    ]
  },
  inspectCoins: {
    text: " A small leather pouch containing ancient gold coins. These might be useful.",
    choices: [
      { text: "Take the coins", nextState: "treasureChamber", action: "addItem", item: "Bag of Coins" },
      { text: "Leave them", nextState: "treasureChamber" }
    ]
  },
  inspectSymbol: {
    text: " An ornate metal symbol, clearly designed to fit into something. It might be important.",
    choices: [
      { text: "Take the symbol", nextState: "treasureChamber", action: "addItem", item: "Insertable Symbol" },
      { text: "Leave it", nextState: "treasureChamber" }
    ]
  },
  inspectBackpack: {
    text: " A sturdy leather backpack that could increase your carrying capacity by 5 slots.",
    choices: [
      { text: "Use the backpack", nextState: "treasureChamber", action: "expandInventory" },
      { text: "Leave it", nextState: "treasureChamber" }
    ]
  },
  exitPath: {
    text: " You find a door with a slot that matches the insertable symbol you found.",
    choices: (inventory) => {
      const choices = [{ text: "Go back", nextState: "treasureChamber" }];
      if (inventory.includes('Insertable Symbol')) {
        choices.unshift({ 
          text: "Use the symbol to exit", 
          nextState: "escapeWithoutArtifact",
          action: "useItem",
          item: "Insertable Symbol"
        });
      }
      return choices;
    }
  },
  keyRoom: {
    text: " You enter a chamber with a pedestal in the center. A golden key rests upon it. The floor looks unstable.",
    choices: (inventory) => {
      const choices = [{ text: "Go back", nextState: "treasureChamber" }];
      if (inventory.includes('Bag of Coins')) {
        choices.unshift({ 
          text: "Use coins to test the floor", 
          nextState: "getKey",
          action: "useItem",
          item: "Bag of Coins"
        });
      }
      choices.unshift({ text: "Try the narrow side passage", nextState: "spikesTrap" });
      return choices;
    }
  },
  spikesTrap: {
    text: " As you step into the narrow passage, you trigger a pressure plate. Spikes shoot out from the walls! \n\n*** YOU ARE DEAD ***",
    choices: [
      { text: "Play Again", nextState: "start" },
      { text: "Return to Title Screen", nextState: "intro" }
    ],
    onEnter: (setInventory) => {
      setInventory([]);
    }
  },
  getKey: {
    text: " Using the coins, you identify the safe path across the unstable floor. You successfully retrieve the key!",
    choices: [
      { text: "Take the passage ahead", nextState: "hydrationChoice" }
    ],
    onEnter: (setInventory, inventory) => {
      setInventory([...inventory.filter(item => item !== 'Bag of Coins'), 'Golden Key']);
    }
  },
  hydrationChoice: {
    text: " The passage ahead seems long. You're feeling quite thirsty.",
    choices: (inventory) => {
      const choices = [{ text: "Continue without drinking", nextState: "continuePassage" }];
      if (inventory.includes('Canteen of Water')) {
        choices.unshift({ 
          text: "Drink from your canteen", 
          nextState: "findSecretRoom",
          action: "useItem",
          item: "Canteen of Water"
        });
      }
      return choices;
    }
  },
  findSecretRoom: {
    text: " While drinking, you lean against the wall and accidentally press a loose brick, revealing a hidden chamber! Inside, you find an impressive black khopesh sword made of meteoric iron.",
    choices: [
      { text: "Take the khopesh", nextState: "continuePassage", action: "addItem", item: "Khopesh" },
      { text: "Leave it", nextState: "continuePassage" }
    ]
  },
  continuePassage: {
    text: " Following the passage, you eventually reach the maze of sarcophagi from earlier. The mummy is still here!",
    choices: (inventory) => {
      const choices = [];
      if (inventory.includes('Torch')) {
        choices.push({ text: "Attack with the torch", nextState: "defeatMummy", action: "useItem", item: "Torch" });
      }
      if (inventory.includes('Khopesh')) {
        choices.push({ text: "Fight with the khopesh", nextState: "defeatMummy" });
      }
      if (choices.length === 0) {
        choices.push({ 
          text: "The mummy attacks!", 
          nextState: "mummyDeath" 
        });
      }
      return choices;
    }
  },
  mummyDeath: {
    text: " Without any means to defend yourself, the mummy's ancient curse drains your life force. \n\n*** YOU ARE DEAD ***",
    choices: [
      { text: "Play Again", nextState: "start" },
      { text: "Return to Title Screen", nextState: "intro" }
    ],
    onEnter: (setInventory) => {
      setInventory([]);
    }
  },
  defeatMummy: {
    text: " You successfully defeat the mummy! The Book of Spells lies nearby.",
    choices: [
      { text: "Take the Book of Spells", nextState: "returnToStart", action: "addItem", item: "Book of Spells" },
      { text: "Leave it", nextState: "returnToStart" }
    ]
  },
  returnToStart: {
    text: " You return to the main chamber. The three paths still await your choice.",
    choices: [
      { text: "Take the left path", nextState: "leftPath" },
      { text: "Take the right path", nextState: "rightPath" },
      { text: "Go straight ahead", nextState: "centerPath" }
    ]
  },
  rightPathWithKey: {
    text: " You reach the sealed chamber again.",
    choices: (inventory) => {
      const choices = [{ text: "Return to main chamber", nextState: "returnToStart" }];
      if (inventory.includes('Golden Key')) {
        choices.unshift({ 
          text: "Use the key", 
          nextState: "hieroglyphChamber",
          action: "useItem",
          item: "Golden Key"
        });
      }
      return choices;
    }
  },
  hieroglyphChamber: {
    text: " The chamber walls are covered in intricate hieroglyphs.",
    choices: [
      { text: "Inspect the hieroglyphs", nextState: "readHieroglyphs" },
      { text: "Go back", nextState: "returnToStart" }
    ]
  },
  readHieroglyphs: {
    text: " You notice a symbol that matches the one on the Book of Spells perfectly!",
    choices: (inventory) => {
      const choices = [{ text: "Go back", nextState: "hieroglyphChamber" }];
      if (inventory.includes('Book of Spells')) {
        choices.unshift({ 
          text: "Read the spell", 
          nextState: "serpopardChamber",
          action: "useItem",
          item: "Book of Spells"
        });
      }
      return choices;
    }
  },
  serpopardChamber: {
    text: " A hidden door opens, revealing a chamber containing a terrifying Serpopard - a creature with the head and neck of a serpent but the body of a leopard!",
    choices: (inventory) => {
      const choices = [];
      if (inventory.includes('Khopesh')) {
        choices.push({ text: "Fight the Serpopard", nextState: "defeatSerpopard" });
      } else {
        choices.push({ 
          text: "The Serpopard attacks!", 
          nextState: "serpopardDeath" 
        });
      }
      return choices;
    }
  },
  serpopardDeath: {
    text: " Without a proper weapon, you're no match for the mythical beast. The Serpopard's venomous bite proves fatal. \n\n*** YOU ARE DEAD ***",
    choices: [
      { text: "Play Again", nextState: "start" },
      { text: "Return to Title Screen", nextState: "intro" }
    ],
    onEnter: (setInventory) => {
      setInventory([]);
    }
  },
  defeatSerpopard: {
    text: " Using the khopesh, you defeat the mythical beast! The chamber contains a slot that matches your insertable symbol.",
    choices: (inventory) => {
      const choices = [{ text: "Search the chamber", nextState: "findSymbolSlot" }];
      if (inventory.includes('Insertable Symbol')) {
        choices.unshift({ 
          text: "Use the symbol", 
          nextState: "artifactChamber",
          action: "useItem",
          item: "Insertable Symbol"
        });
      }
      return choices;
    }
  },
  findSymbolSlot: {
    text: " You find a slot that seems to require a specific symbol to activate.",
    choices: [
      { text: "Go back", nextState: "defeatSerpopard" }
    ]
  },
  artifactChamber: {
    text: " You enter a small chamber containing the Golden Scarab artifact on a raised pedestal!",
    choices: [
      { text: "Take the Golden Scarab", nextState: "victory", action: "addItem", item: "Golden Scarab" }
    ]
  },
  victory: {
    text: " As you grab the Golden Scarab, the pedestal rises up through an opening in the ceiling. You emerge outside the temple, artifact in hand. Congratulations! You've succeeded in your quest! \n\n*** VICTORY - BEST ENDING ***",
    choices: [
      { text: "Play Again", nextState: "start" },
      { text: "Return to Title Screen", nextState: "intro" }
    ],
    onEnter: (setInventory) => {
      setInventory([]);
    }
  },
  escapeWithoutArtifact: {
    text: " You've managed to escape the temple alive, though without the Golden Scarab. At least you survived! \n\n*** VICTORY - SURVIVAL ENDING ***",
    choices: [
      { text: "Play Again", nextState: "start" },
      { text: "Return to Title Screen", nextState: "intro" }
    ],
    onEnter: (setInventory) => {
      setInventory([]);
    }
  }
};

function useTypewriter(text, speed = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [shouldSkip, setShouldSkip] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setShouldSkip(false);
  }, [text]);

  useEffect(() => {
    if (shouldSkip) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, shouldSkip]);

  return [displayedText, isComplete, setShouldSkip];
}

function App() {
  const [currentState, setCurrentState] = useState('intro');
  const [inventory, setInventory] = useState([]);
  const [maxInventorySize, setMaxInventorySize] = useState(5);
  const [displayedText, isTextComplete, setSkipTypewriter] = useTypewriter(
    typeof gameStates[currentState].text === 'function' 
      ? gameStates[currentState].text(inventory) 
      : gameStates[currentState].text
  );
  const [pendingItem, setPendingItem] = useState(null);
  const [previousState, setPreviousState] = useState(null);

  useEffect(() => {
    if (gameStates[currentState].onEnter) {
      gameStates[currentState].onEnter(setInventory, inventory);
    }
  }, [currentState]);

  const handleClick = () => {
    if (!isTextComplete) {
      setSkipTypewriter(true);
    }
  };

  const handleChoice = (choice) => {
    if (!isTextComplete) return;
    
    if (choice.action === 'addItem') {
      if (inventory.length >= maxInventorySize) {
        setPendingItem(choice.item);
        setPreviousState(currentState);
        setCurrentState('dropItem');
        return;
      }
      if (!inventory.includes(choice.item)) {
        setInventory([...inventory, choice.item]);
      }
    } else if (choice.action === 'replaceItem') {
      const newInventory = inventory.filter(item => item !== choice.dropItem);
      setInventory([...newInventory, choice.addItem]);
      setPendingItem(null);
    } else if (choice.action === 'expandInventory') {
      setMaxInventorySize(maxInventorySize + 5);
    } else if (choice.action === 'useItem') {
      setInventory(inventory.filter(item => item !== choice.item));
    }
    
    setCurrentState(choice.nextState);
  };

  const getCurrentChoices = () => {
    if (currentState === 'dropItem' && gameStates[currentState].getChoices) {
      return gameStates[currentState].getChoices(inventory, pendingItem, previousState);
    }
    if (typeof gameStates[currentState].choices === 'function') {
      return gameStates[currentState].choices(inventory);
    }
    return gameStates[currentState].choices;
  };

  const getCurrentText = () => {
    const text = gameStates[currentState].text;
    return typeof text === 'function' ? text(inventory) : text;
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        {currentState === 'intro' ? (
          <IntroScreen>
            <TitleText>
              TEMPLE OF THE{'\n'}GOLDEN SCARAB
            </TitleText>
            <SubTitle>A Text Adventure</SubTitle>
            {gameStates[currentState].choices.map((choice, index) => (
              <StyledButton key={index} onClick={() => handleChoice(choice)} fadeIn>
                {choice.text}
              </StyledButton>
            ))}
          </IntroScreen>
        ) : (
          <GameScreen onClick={handleClick}>
            <TypewriterText visible={true}>
              {displayedText}
              {!isTextComplete && <Cursor />}
            </TypewriterText>
            {inventory.length > 0 && (
              <Inventory>
                Inventory ({inventory.length}/{maxInventorySize}): {inventory.join(', ')}
              </Inventory>
            )}
            {isTextComplete && (
              <div>
                {getCurrentChoices().map((choice, index) => (
                  <StyledButton
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoice(choice);
                    }}
                    disabled={choice.action === 'addItem' && inventory.length >= maxInventorySize}
                  >
                    {choice.text}
                    {choice.action === 'addItem' && inventory.length >= maxInventorySize ? ' (Inventory Full)' : ''}
                  </StyledButton>
                ))}
              </div>
            )}
          </GameScreen>
        )}
      </Container>
    </>
  );
}

export default App;
