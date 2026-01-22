import React from 'react';
import type { ContractStatus } from '../../../types';
import './StatusStepper.css';

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
      <div className="stepper-revoked">
        🚫 This contract has been <strong>Revoked</strong> and cannot proceed further.
      </div>
    );
  }

  return (
    <div className="stepper-container">
      {statusOrder.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        return (
          <div key={step} className="step-item">
            <div className={`step-circle ${isCompleted ? 'completed' : ''}`}>
              {index + 1}
            </div>
            <div className={`step-label ${isCurrent ? 'current' : ''}`}>
              {step}
            </div>
            {/* Connecting Line */}
            {index < statusOrder.length - 1 && (
              <div className={`step-line ${index < currentStepIndex ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
