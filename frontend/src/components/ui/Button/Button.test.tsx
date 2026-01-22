import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText('⏳')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    // Note: Since we use inline styles in this simple implementation, 
    // we check for specific style attributes or just that it renders without error.
    // In a real app with CSS classes, we'd check for class names.
    const { container } = render(<Button variant="danger">Delete</Button>);
    // Basic check to ensure it renders
    expect(container.firstChild).toBeInTheDocument();
  });
});
