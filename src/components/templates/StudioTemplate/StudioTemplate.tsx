import React, { useState, useEffect, useCallback, ErrorBoundary } from 'react';
import { styles, getResponsiveStyles } from './StudioTemplate.styles';
import { Button } from '../../atoms/Button';
import { Pixel } from '../../atoms/Pixel';
import Navigation from '../../organisms/Navigation/Navigation';

/**
 * Canvas size options
 */
const CANVAS_SIZES = [8, 16, 32];

/**
 * Color palette
 */
const COLOR_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', 
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#808080', '#C0C0C0', '#800000', '#808000',
  '#008000', '#800080', '#008080', '#000080',
];

/**
 * Drawing tools
 */
const TOOLS = [
  { id: 'pen', name: 'Pen', icon: '✏️' },
  { id: 'eraser', name: 'Eraser', icon: '🧽' },
  { id: 'fill', name: 'Fill', icon: '🪣' },
  { id: 'eyedropper', name: 'Picker', icon: '👁️' },
];

/**
 * Error boundary component for StudioTemplate
 */
class StudioErrorBoundary extends React.Component<
  { children: React.ReactNode }, 
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Studio error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong in the Pixel Studio</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <Button 
            variant="primary" 
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Props for StudioTemplate component
 */
export interface StudioTemplateProps {
  /**
   * Initial canvas data (optional)
   */
  initialData?: string[][];
  
  /**
   * Callback when canvas is saved
   */
  onSave?: (pixelData: string[][], name: string) => void;
  
  /**
   * Custom styles
   */
  customStyle?: React.CSSProperties;
}

/**
 * StudioTemplate component
 * 
 * A pixel art editor with tools for creating ship designs
 * 
 * @param initialData - Optional initial pixel data
 * @param onSave - Callback when canvas is saved
 * @param customStyle - Custom styles
 */
const StudioTemplate: React.FC<StudioTemplateProps> = ({
  initialData,
  onSave,
  customStyle = {},
}) => {
  // Canvas state
  const [canvasSize, setCanvasSize] = useState<number>(16);
  const [pixelData, setPixelData] = useState<string[][]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);
  const [selectedTool, setSelectedTool] = useState<string>('pen');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [shipName, setShipName] = useState<string>('');
  
  // UI state
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [responsiveStyles, setResponsiveStyles] = useState(getResponsiveStyles(window.innerWidth));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    initializeCanvas();
  }, [canvasSize]);
  
  // Import initial data if provided
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const size = initialData.length;
      if (CANVAS_SIZES.includes(size)) {
        setCanvasSize(size);
        setPixelData(initialData);
      }
    }
  }, [initialData]);
  
  // Responsive design handling
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setResponsiveStyles(getResponsiveStyles(window.innerWidth));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Clear success message after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  /**
   * Initialize canvas with empty pixels
   */
  const initializeCanvas = useCallback(() => {
    const newCanvas = Array(canvasSize).fill(0).map(() => 
      Array(canvasSize).fill('rgba(0, 0, 0, 0)')
    );
    setPixelData(newCanvas);
  }, [canvasSize]);
  
  /**
   * Handle color change
   */
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    // If eyedropper tool is active, switch back to pen
    if (selectedTool === 'eyedropper') {
      setSelectedTool('pen');
    }
  };
  
  /**
   * Handle tool selection
   */
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };
  
  /**
   * Handle canvas size change
   */
  const handleSizeChange = (newSize: number) => {
    if (window.confirm('Changing canvas size will reset your current drawing. Continue?')) {
      setCanvasSize(newSize);
    }
  };
  
  /**
   * Start drawing operation
   */
  const startDrawing = () => {
    setIsDrawing(true);
  };
  
  /**
   * Stop drawing operation
   */
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  /**
   * Update pixel color based on selected tool
   */
  const updatePixel = (rowIndex: number, colIndex: number) => {
    setPixelData(prev => {
      const newData = [...prev.map(row => [...row])];
      
      switch (selectedTool) {
        case 'pen':
          newData[rowIndex][colIndex] = selectedColor;
          break;
        
        case 'eraser':
          newData[rowIndex][colIndex] = 'rgba(0, 0, 0, 0)';
          break;
        
        case 'eyedropper':
          const pickedColor = prev[rowIndex][colIndex];
          if (pickedColor !== 'rgba(0, 0, 0, 0)') {
            setSelectedColor(pickedColor);
            setSelectedTool('pen');
          }
          break;
        
        case 'fill':
          const targetColor = prev[rowIndex][colIndex];
          if (targetColor !== selectedColor) {
            // Simple flood fill algorithm
            const floodFill = (r: number, c: number) => {
              if (
                r < 0 || r >= canvasSize || 
                c < 0 || c >= canvasSize || 
                newData[r][c] !== targetColor
              ) {
                return;
              }
              
              newData[r][c] = selectedColor;
              
              floodFill(r + 1, c);
              floodFill(r - 1, c);
              floodFill(r, c + 1);
              floodFill(r, c - 1);
            };
            
            floodFill(rowIndex, colIndex);
          }
          break;
      }
      
      return newData;
    });
  };
  
  /**
   * Clear the canvas
   */
  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      initializeCanvas();
    }
  };
  
  /**
   * Handle ship name change
   */
  const handleShipNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipName(e.target.value);
  };
  
  /**
   * Save the canvas
   */
  const handleSaveCanvas = () => {
    if (!shipName.trim()) {
      setError('Please enter a ship name');
      return;
    }
    
    if (onSave) {
      try {
        onSave(pixelData, shipName);
        setSuccess('Ship saved successfully!');
      } catch (err) {
        setError('Failed to save ship');
        console.error('Save error:', err);
      }
    } else {
      setSuccess('Ship design completed!');
      console.log('Ship data:', { pixelData, name: shipName });
    }
  };
  
  /**
   * Generate preview using box-shadow technique
   */
  const generatePreview = () => {
    const boxShadow = pixelData
      .flatMap((row, rowIndex) => 
        row.map((color, colIndex) => 
          color !== 'rgba(0, 0, 0, 0)' 
            ? `${colIndex}px ${rowIndex}px 0 0 ${color}` 
            : null
        )
      )
      .filter(Boolean)
      .join(', ');
    
    return (
      <div
        style={{
          width: '100px',
          height: '100px',
          margin: '0 auto',
          backgroundColor: 'transparent',
          boxShadow: boxShadow || 'none',
        }}
      />
    );
  };
  
  return (
    <StudioErrorBoundary>
      <div style={{ ...styles.container, ...customStyle }}>
        <Navigation />
        
        <div style={styles.content}>
          <div style={{ ...styles.mainGrid, ...responsiveStyles.mainGrid }}>
            {/* Canvas section */}
            <div style={styles.canvasContainer}>
              <div 
                style={{
                  ...styles.canvasWrapper,
                  cursor: selectedTool === 'eyedropper' ? 'crosshair' : 'default',
                }}
              >
                <div 
                  style={{
                    ...styles.canvasGrid,
                    gridTemplateColumns: `repeat(${canvasSize}, 1fr)`,
                  }}
                >
                  {pixelData.map((row, rowIndex) => 
                    row.map((color, colIndex) => (
                      <Pixel
                        key={`${rowIndex}-${colIndex}`}
                        rowIndex={rowIndex}
                        columnIndex={colIndex}
                        color={color}
                        size={canvasSize}
                        isDrawing={isDrawing}
                        onStartDrawing={startDrawing}
                        onStopDrawing={stopDrawing}
                        onColorChange={() => updatePixel(rowIndex, colIndex)}
                        selectedColor={selectedColor}
                      />
                    ))
                  )}
                </div>
              </div>
              
              {/* Ship name input */}
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="shipName">
                  Ship Name
                </label>
                <input
                  id="shipName"
                  type="text"
                  value={shipName}
                  onChange={handleShipNameChange}
                  placeholder="Enter a name for your ship"
                  style={styles.input}
                />
              </div>
              
              {/* Status messages */}
              {error && (
                <div style={styles.errorMessage}>
                  {error}
                </div>
              )}
              
              {success && (
                <div style={styles.successMessage}>
                  {success}
                </div>
              )}
              
              {/* Canvas controls */}
              <div style={{ ...styles.controlsBar, ...responsiveStyles.controlsBar }}>
                <div style={styles.actionsContainer}>
                  <Button 
                    variant="secondary" 
                    onClick={handleClearCanvas}
                  >
                    Clear Canvas
                  </Button>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={handleSaveCanvas}
                >
                  Save Ship
                </Button>
              </div>
            </div>
            
            {/* Tools panel */}
            <div style={{ ...styles.toolsPanel, ...responsiveStyles.toolsPanel }}>
              {/* Drawing tools */}
              <div style={styles.toolSection}>
                <h3 style={styles.toolSectionTitle}>Tools</h3>
                <div style={{ ...styles.toolGrid, ...responsiveStyles.toolGrid }}>
                  {TOOLS.map(tool => (
                    <div
                      key={tool.id}
                      style={{
                        ...styles.toolButton,
                        ...(selectedTool === tool.id ? styles.toolButtonActive : {}),
                      }}
                      onClick={() => handleToolSelect(tool.id)}
                      title={tool.name}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Canvas size */}
              <div style={styles.toolSection}>
                <h3 style={styles.toolSectionTitle}>Canvas Size</h3>
                <div style={styles.sizeSelector}>
                  {CANVAS_SIZES.map(size => (
                    <div
                      key={size}
                      style={{
                        ...styles.sizeOption,
                        ...(canvasSize === size ? styles.sizeOptionActive : {}),
                      }}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}x{size}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Color picker */}
              <div style={styles.toolSection}>
                <h3 style={styles.toolSectionTitle}>Colors</h3>
                <div style={{ ...styles.colorGrid, ...responsiveStyles.colorGrid }}>
                  {COLOR_PALETTE.map(color => (
                    <div
                      key={color}
                      style={{
                        ...styles.colorSwatch,
                        backgroundColor: color,
                        ...(selectedColor === color ? styles.colorSwatchActive : {}),
                      }}
                      onClick={() => handleColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
                
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={styles.colorCustomInput}
                  title="Custom color"
                />
              </div>
              
              {/* Preview */}
              <div style={styles.previewContainer}>
                <h3 style={styles.toolSectionTitle}>Preview</h3>
                {generatePreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudioErrorBoundary>
  );
};

export default StudioTemplate;

