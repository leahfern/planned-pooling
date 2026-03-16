import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontSizes.small};
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  max-width: 90vw;
  text-align: center;
  background: ${(props) =>
    props.$type === 'error' ? props.theme.colors.primary : props.theme.colors.text};
  color: ${(props) => props.theme.colors.white};
`;

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
}

export function Toast({ message, type = 'success' }: ToastProps) {
  if (!message) return null;
  return (
    <ToastContainer $type={type} role="status" aria-live="polite">
      {message}
    </ToastContainer>
  );
}
