import React, { ButtonHTMLAttributes } from 'react';
import { styles, ButtonVariant } from './Button.styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  customStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  customStyle,
  children,
  disabled,
  ...props
}) => {
  const combinedStyles: React.CSSProperties = {
    ...styles.base,
    ...styles[variant],
    ...(disabled ? styles.disabled : {}),
    ...customStyle,
  };

  return (
    <button style={combinedStyles} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
