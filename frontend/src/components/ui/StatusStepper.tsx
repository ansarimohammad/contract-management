import React from 'react';
import type { ContractStatus } from '../../types';

interface StatusStepperProps {
  currentStatus: ContractStatus;
  statusOrder?: ContractStatus[];
}

const DEFAULT_ORDER: ContractStatus[] = ['Created', 'Approved', 'Sent', 'Signed', 'Locked'];

export const StatusStepper: React.FC<StatusStepperProps> = ({ 
  currentStatus, 
  statusOrder = DEFAULT_ORDER 
}) => {
  const currentStepIndex = statusOrder.indexOf(currentStatus);
  const isRevoked = currentStatus === 'Revoked';

  if (isRevoked) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', background: '#fee2e2', borderRadius: '8px', color: '#991b1b' }}>
        🚫 This contract has been <strong>Revoked</strong> and cannot proceed further.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', marginBottom: '40px', position: 'relative', justifyContent: 'space-between' }}>
      {statusOrder.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        return (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            <div style={{ 
              width: '30px', height: '30px', borderRadius: '50%', 
              background: isCompleted ? '#3b82f6' : '#e5e7eb',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', zIndex: 2,
              transition: 'background-color 0.3s'
            }}>
              {index + 1}
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: isCurrent ? 'bold' : 'normal', color: isCurrent ? '#3b82f6' : '#6b7280' }}>
              {step}
            </div>
            {/* Connecting Line */}
            {index < statusOrder.length - 1 && (
              <div style={{ 
                position: 'absolute', top: '15px', left: '50%', width: '100%', height: '2px', 
                background: index < currentStepIndex ? '#3b82f6' : '#e5e7eb',
                zIndex: 1,
                transition: 'background-color 0.3s'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
