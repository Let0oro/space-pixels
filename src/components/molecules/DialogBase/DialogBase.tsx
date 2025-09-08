import React, { ReactNode, useEffect, useRef } from 'react';
import { Button } from '../../atoms/Button';
import { styles } from './DialogBase.styles';

export interface DialogBaseProps {
  /**
   * Dialog title
   */
  title: string;
  
  /**
   * Dialog content
   */
  children: ReactNode;
  
  /**
   * Whether the dialog is open
   */
  isOpen: boolean;
  
  /**
   * Callback function when the dialog is closed
   */
  onClose: () => void;
  
  /**
   * Optional footer buttons (defaults to a close button)
   */
  footerButtons?: ReactNode;
  
  /**
   * Whether to show the close button in the header
   */
  showCloseButton?: boolean;
  
  /**
   * Additional custom styles for the dialog
   */
  dialogStyle?: React.CSSProperties;
  
  /**
   * Custom styles for the content section
   */
  contentStyle?: React.CSSProperties;
}

/**
 * DialogBase component - Base dialog component that can be extended
 * 
 * @param title - Dialog title
 * @param children - Dialog content
 * @param isOpen - Whether the dialog is open
 * @param onClose - Callback function when the dialog is closed
 * @param footerButtons - Optional footer buttons
 * @param showCloseButton - Whether to show the close button in the header
 * @param dialogStyle - Additional custom styles for the dialog
 * @param contentStyle - Custom styles for the content section
 */
const DialogBase = ({
  title,
  children,
  isOpen,
  onClose,
  footerButtons,
  showCloseButton = true,
  dialogStyle = {},
  contentStyle = {},
}: DialogBaseProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  // Close when clicking on the backdrop
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;
    
    const rect = dialogElement.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    
    if (!isInDialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      style={{ ...styles.dialog, ...dialogStyle }}
      onClick={handleDialogClick}
      onClose={onClose}
    >
      <header style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        {showCloseButton && (
          <Button 
            variant="link" 
            onClick={onClose} 
            aria-label="Close dialog"
          >
            ✕
          </Button>
        )}
      </header>
      
      <div style={{ ...styles.content, ...contentStyle }}>
        {children}
      </div>
      
      <footer style={styles.footer}>
        {footerButtons || (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        )}
      </footer>
    </dialog>
  );
};

export default DialogBase;

