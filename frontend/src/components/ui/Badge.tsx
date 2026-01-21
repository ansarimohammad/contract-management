import React from 'react';
import type { ContractStatus } from '../../types';

interface BadgeProps {
  status: ContractStatus | string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let bg = '#e5e7eb';
  let color = '#374151';

  switch (status) {
    case 'Signed':
    case 'Approved':
      bg = '#d1fae5';
      color = '#065f46';
      break;
    case 'Sent':
      bg = '#dbeafe';
      color = '#1e40af';
      break;
    case 'Revoked':
      bg = '#fee2e2';
      color = '#991b1b';
      break;
    case 'Created':
      bg = '#f3f4f6';
      color = '#4b5563';
      break;
    case 'Locked':
      bg = '#e5e7eb';
      color = '#374151';
      break;
  }

  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: bg,
      color: color,
    }}>
      {status}
    </span>
  );
};
