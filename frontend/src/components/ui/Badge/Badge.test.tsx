import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge/Badge';

describe('Badge', () => {
  it('renders the status text', () => {
    render(<Badge status="Approved" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders correct style for "Signed" status', () => {
    // We can check styles indirectly or just ensure it renders without crashing
    const { container } = render(<Badge status="Signed" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ backgroundColor: 'rgb(209, 250, 229)' }); // #d1fae5
    expect(span).toHaveStyle({ color: 'rgb(6, 95, 70)' }); // #065f46
  });

  it('renders correct style for "Revoked" status', () => {
    const { container } = render(<Badge status="Revoked" />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ backgroundColor: 'rgb(254, 226, 226)' }); // #fee2e2
    expect(span).toHaveStyle({ color: 'rgb(153, 27, 27)' }); // #991b1b
  });
});
