import React from 'react';
import type { ContractStatus } from '../../../types';
import './Badge.css';

interface BadgeProps {
  status: ContractStatus | string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Signed':
      case 'Approved':
        return 'badge-approved';
      case 'Sent':
        return 'badge-sent';
      case 'Revoked':
        return 'badge-revoked';
      case 'Created':
      case 'Locked':
      default:
        return 'badge-created';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status}
    </span>
  );
};
