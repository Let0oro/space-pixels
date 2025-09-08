import { ReactNode, useState, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { styles, getResponsiveStyles } from './GameTemplate.styles';

export interface GameScore {
  score: number;
  level: number;
  lives: number;
}

export interface GameTemplateProps {
  /**
   * Game content (the actual game component)
   */
  children: ReactNode;
  
  /**
   * Current game score data
   */
  scoreData: GameScore;
  
  /**
   * Whether the game is paused
   */
  isPaused: boolean;
  
  /**
   * Whether the game is over
   */
  isGameOver: boolean;
  
  /**
   * Function to start a new game
   */
  onNewGame: () => void;
  
  /**
   * Function to pause/resume the game
   */
  onTogglePause: () => void;
  
  /**
   * Function to exit the game
   */
  onExitGame: () => void;
  
  /**
   * Optional content to display when the game is over
   */
  gameOverContent?: ReactNode;
  
  /**
   * Optional content to display when the game is paused
   */
  pauseContent?: ReactNode;
  
  /**
   * Custom styles for the container
   */
  customStyle?: React.CSSProperties;
}

/**
 * GameTemplate component - Layout template for game screens
 */
const GameTemplate = ({
  children,
  scoreData,
  isPaused,
  isGameOver,
  onNewGame,
  onTogglePause,
  onExitGame,
  gameOverContent,
  pauseContent,
  customStyle = {},
}: GameTemplateProps) => {
  // State for responsive styles
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [responsiveStyles, setResponsiveStyles] = useState(getResponsiveStyles(window.innerWidth));
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setResponsiveStyles(getResponsiveStyles(window.innerWidth));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update document title
  useEffect(() => {
    document.title = `Space Pixels | Game - Score: ${scoreData.score}`;
  }, [scoreData.score]);
  
  // Render default game over content if not provided
  const renderGameOverContent = () => {
    if (gameOverContent) {
      return gameOverContent;
    }
    
    return (
      <div style={styles.gameOverlay}>
        <h2>Game Over</h2>
        <p>Your score: {scoreData.score}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="primary" onClick={onNewGame}>
            New Game
          </Button>
          <Button variant="secondary" onClick={onExitGame}>
            Exit Game
          </Button>
        </div>
      </div>
    );
  };
  
  // Render default pause content if not provided
  const renderPauseContent = () => {
    if (pauseContent) {
      return pauseContent;
    }
    
    return (
      <div style={styles.gameOverlay}>
        <h2>Game Paused</h2>
        <div style={{ display: 'flex', gap: '1rem',

