import React, { useState } from 'react';
import { Gamepad2, Gift, Star, Trophy, Zap, Target, Award, Coins } from 'lucide-react';

export function LoyaltyGameManager() {
  const [gameActive, setGameActive] = useState(false);
  const [userPoints, setUserPoints] = useState(2450);
  const [gamePoints, setGamePoints] = useState(0);
  const [currentGame, setCurrentGame] = useState('memory');
  const [gameLevel, setGameLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  // Trivia Game State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);

  // Spin Wheel State
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);

  const games = [
    {
      id: 'memory',
      name: 'Memoria Norteña',
      description: 'Encuentra las parejas de destinos del norte',
      icon: Target,
      maxPoints: 100,
      difficulty: 'Fácil'
    },
    {
      id: 'trivia',
      name: 'Trivia del Norte',
      description: 'Responde preguntas sobre el norte del Perú',
      icon: Trophy,
      maxPoints: 150,
      difficulty: 'Medio'
    },
    {
      id: 'wheel',
      name: 'Ruleta de la Suerte',
      description: 'Gira la ruleta y gana puntos',
      icon: Zap,
      maxPoints: 200,
      difficulty: 'Suerte'
    }
  ];

  const triviaQuestions = [
    {
      question: '¿Cuál es la capital de La Libertad?',
      options: ['Chiclayo', 'Trujillo', 'Piura', 'Cajamarca'],
      correct: 1,
      points: 25
    },
    {
      question: '¿Qué cultura construyó Chan Chan?',
      options: ['Moche', 'Chimú', 'Inca', 'Chavín'],
      correct: 1,
      points: 30
    },
    {
      question: '¿En qué región se encuentra Máncora?',
      options: ['Lambayeque', 'La Libertad', 'Piura', 'Tumbes'],
      correct: 2,
      points: 20
    },
    {
      question: '¿Cuál es el plato típico de Chiclayo?',
      options: ['Ceviche', 'Arroz con pato', 'Pachamanca', 'Anticuchos'],
      correct: 1,
      points: 25
    }
  ];

  const wheelPrizes = [
    { label: '10 puntos', points: 10, color: '#e3a518' },
    { label: '25 puntos', points: 25, color: '#0d2c4e' },
    { label: '50 puntos', points: 50, color: '#e3a518' },
    { label: '100 puntos', points: 100, color: '#0d2c4e' },
    { label: '5 puntos', points: 5, color: '#e3a518' },
    { label: '75 puntos', points: 75, color: '#0d2c4e' }
  ];

  const initializeMemoryGame = () => {
    const destinations = ['Trujillo', 'Chiclayo', 'Piura', 'Cajamarca', 'Tumbes', 'Chimbote'];
    const cards = [...destinations, ...destinations]
      .sort(() => Math.random() - 0.5)
      .map((dest, index) => ({ id: index, destination: dest, flipped: false }));
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedCards([]);
  };

  const startGame = (gameId) => {
    setCurrentGame(gameId);
    setGameActive(true);
    setGameStarted(true);
    setGamePoints(0);
    setTimeLeft(30);

    if (gameId === 'memory') {
      initializeMemoryGame();
    } else if (gameId === 'trivia') {
      setCurrentQuestion(0);
      setTriviaScore(0);
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setGameActive(false);
    setGameStarted(false);
    setUserPoints(prev => prev + gamePoints);
    
    // Show results
    alert(`¡Juego terminado! Ganaste ${gamePoints} puntos.`);
  };

  const handleMemoryCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = memoryCards.find(card => card.id === first);
      const secondCard = memoryCards.find(card => card.id === second);

      if (firstCard.destination === secondCard.destination) {
        setMatchedCards(prev => [...prev, first, second]);
        setGamePoints(prev => prev + 20);
        setFlippedCards([]);

        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(endGame, 1000);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const handleTriviaAnswer = (answerIndex) => {
    const question = triviaQuestions[currentQuestion];
    if (answerIndex === question.correct) {
      setGamePoints(prev => prev + question.points);
      setTriviaScore(prev => prev + 1);
    }

    if (currentQuestion + 1 < triviaQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTimeout(endGame, 1000);
    }
  };

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * wheelPrizes.length);
    const prize = wheelPrizes[randomIndex];
    
    setTimeout(() => {
      setWheelResult(prize);
      setGamePoints(prize.points);
      setSpinning(false);
      setTimeout(endGame, 2000);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro">Centro de Juegos - Programa Fidelidad</h1>
            <p className="mt-1 text-sm text-gris-suave">
              Juega y gana puntos para tu programa de fidelidad
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-4 md:mt-0 md:ml-4">
            <div className="bg-amarillo-dorado text-azul-oscuro px-4 py-2 rounded-lg font-bold">
              <Coins className="h-5 w-5 inline mr-2" />
              {userPoints.toLocaleString()} puntos
            </div>
          </div>
        </div>
      </div>

      {!gameActive ? (
        <>
          {/* Game Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {games.map((game) => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-20 h-20 bg-azul-oscuro rounded-full flex items-center justify-center mx-auto mb-6">
                    <game.icon className="h-10 w-10 text-amarillo-dorado" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-azul-oscuro mb-3">
                    {game.name}
                  </h3>
                  
                  <p className="text-gris-suave mb-4">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {game.difficulty}
                    </span>
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Hasta {game.maxPoints} pts
                    </span>
                  </div>
                  
                  <button
                    onClick={() => startGame(game.id)}
                    className="w-full bg-azul-oscuro text-white py-3 px-6 rounded-xl hover:bg-primary-600 transition-colors font-semibold"
                  >
                    Jugar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-azul-oscuro mb-6 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-amarillo-dorado" />
              Tabla de Líderes
            </h3>
            
            <div className="space-y-4">
              {[
                { name: 'María González', points: 3450, position: 1 },
                { name: 'Carlos Mendoza', points: 3200, position: 2 },
                { name: 'Ana Rodríguez', points: 2890, position: 3 },
                { name: 'Luis García', points: 2650, position: 4 },
                { name: 'Tú', points: userPoints, position: 5 }
              ].map((player, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                  player.name === 'Tú' ? 'bg-amarillo-dorado/20 border-2 border-amarillo-dorado' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.position === 1 ? 'bg-yellow-500 text-white' :
                      player.position === 2 ? 'bg-gray-400 text-white' :
                      player.position === 3 ? 'bg-amber-600 text-white' : 'bg-azul-oscuro text-white'
                    }`}>
                      {player.position}
                    </div>
                    <span className="font-medium text-azul-oscuro">{player.name}</span>
                  </div>
                  <span className="font-bold text-azul-oscuro">
                    {player.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Game Area */
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-azul-oscuro">
              {games.find(g => g.id === currentGame)?.name}
            </h2>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-azul-oscuro">{timeLeft}s</div>
                <div className="text-sm text-gris-suave">Tiempo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amarillo-dorado">{gamePoints}</div>
                <div className="text-sm text-gris-suave">Puntos</div>
              </div>
            </div>
          </div>

          {/* Memory Game */}
          {currentGame === 'memory' && (
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {memoryCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleMemoryCardClick(card.id)}
                  className={`aspect-square rounded-lg text-white font-bold text-lg transition-all ${
                    flippedCards.includes(card.id) || matchedCards.includes(card.id)
                      ? 'bg-azul-oscuro'
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                >
                  {(flippedCards.includes(card.id) || matchedCards.includes(card.id)) 
                    ? card.destination 
                    : '?'
                  }
                </button>
              ))}
            </div>
          )}

          {/* Trivia Game */}
          {currentGame === 'trivia' && currentQuestion < triviaQuestions.length && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="text-sm text-gris-suave mb-2">
                  Pregunta {currentQuestion + 1} de {triviaQuestions.length}
                </div>
                <h3 className="text-xl font-semibold text-azul-oscuro mb-6">
                  {triviaQuestions[currentQuestion].question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {triviaQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleTriviaAnswer(index)}
                      className="p-4 text-left bg-gray-50 hover:bg-azul-oscuro hover:text-white transition-colors rounded-lg border-2 border-transparent hover:border-azul-oscuro"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Wheel Game */}
          {currentGame === 'wheel' && (
            <div className="text-center">
              <div className="relative w-80 h-80 mx-auto mb-8">
                <div className={`w-full h-full rounded-full border-8 border-azul-oscuro relative overflow-hidden ${
                  spinning ? 'animate-spin' : ''
                }`} style={{ animationDuration: spinning ? '3s' : '0s' }}>
                  {wheelPrizes.map((prize, index) => (
                    <div
                      key={index}
                      className="absolute w-full h-full flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundColor: prize.color,
                        clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos(index * 60 * Math.PI / 180)}% ${50 + 40 * Math.sin(index * 60 * Math.PI / 180)}%, ${50 + 40 * Math.cos((index + 1) * 60 * Math.PI / 180)}% ${50 + 40 * Math.sin((index + 1) * 60 * Math.PI / 180)}%)`,
                        transform: `rotate(${index * 60}deg)`
                      }}
                    >
                      <span className="transform -rotate-90">{prize.label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500"></div>
              </div>
              
              {!spinning && !wheelResult && (
                <button
                  onClick={spinWheel}
                  className="bg-amarillo-dorado text-azul-oscuro px-8 py-4 rounded-xl font-bold text-xl hover:bg-yellow-500 transition-colors"
                >
                  ¡Girar Ruleta!
                </button>
              )}
              
              {wheelResult && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-azul-oscuro mb-2">
                    ¡Felicidades!
                  </h3>
                  <p className="text-xl text-amarillo-dorado">
                    Ganaste {wheelResult.points} puntos
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Game Controls */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setGameActive(false);
                setGameStarted(false);
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Salir del Juego
            </button>
          </div>
        </div>
      )}

      {/* Daily Challenges */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-azul-oscuro mb-6 flex items-center">
          <Star className="h-6 w-6 mr-2 text-amarillo-dorado" />
          Desafíos Diarios
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Juega 3 partidas', progress: 2, total: 3, reward: 50 },
            { title: 'Gana 100 puntos', progress: 75, total: 100, reward: 25 },
            { title: 'Completa trivia perfecta', progress: 0, total: 1, reward: 100 }
          ].map((challenge, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-azul-oscuro mb-2">{challenge.title}</h4>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gris-suave mb-1">
                  <span>{challenge.progress}/{challenge.total}</span>
                  <span>{challenge.reward} pts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amarillo-dorado h-2 rounded-full transition-all"
                    style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  />
                </div>
              </div>
              {challenge.progress >= challenge.total && (
                <button className="w-full bg-green-500 text-white py-2 rounded-lg font-medium">
                  ¡Reclamar!
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}