import { useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function toast({ title, description, variant = 'default', duration = 3000 }: ToastOptions) {
  // For simplicity, use alert as placeholder
  alert(`${title}${description ? ': ' + description : ''}`);
}

export default toast;
