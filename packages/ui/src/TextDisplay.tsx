import React from 'react';

interface TextDisplayProps {
  text: string;
  className?: string;
}

export function TextDisplay({ text, className }: TextDisplayProps) {
  return <p className={className}>{text}</p>;
}