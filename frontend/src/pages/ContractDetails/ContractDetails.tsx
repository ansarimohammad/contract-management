import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Contract, Blueprint, ContractStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Badge } from '../../components/ui/Badge/Badge';
import { StatusStepper } from '../../components/ui/StatusStepper/StatusStepper';
import { ContractDocument } from '../../components/ContractDocument/ContractDocument';
import './ContractDetails.css';

const STATUS_ORDER: ContractStatus[] = ['Created', 'Approved', 'Sent', 'Signed', 'Locked'];

export const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'document'>('document');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const c = await storageService.getContract(id);
        if (c) {
          setContract(c);
          const b = await storageService.getBlueprint(c.blueprintId);
          if (b) setBlueprint(b);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: ContractStatus) => {
    if (!contract) return;
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    setUpdating(true);
    try {
      const updated = await storageService.updateContractStatus(contract.id, newStatus);
      setContract(updated);
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!contract || !blueprint) return <div className="container">Contract not found</div>;

  const currentStepIndex = STATUS_ORDER.indexOf(contract.status);
  const isRevoked = contract.status === 'Revoked';
  const isLocked = contract.status === 'Locked';

  // Determine available actions
  const nextStatus = !isRevoked && !isLocked && currentStepIndex < STATUS_ORDER.length - 1 
    ? STATUS_ORDER[currentStepIndex + 1] 
    : null;

  const canRevoke = !isRevoked && !isLocked;

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="details-header">
        <div className="details-header-left">
          <Button onClick={() => navigate('/')}>← Back</Button>
          <div className="details-title-wrapper">
            <h1 className="details-title">{contract.name}</h1>
            <Badge status={contract.status} />
          </div>
        </div>
        
        <div className="details-actions">
          {nextStatus && (
            <Button 
              variant="primary" 
              onClick={() => handleStatusChange(nextStatus)}
              isLoading={updating}
            >
              Mark as {nextStatus}
            </Button>
          )}
          
          {canRevoke && (
            <Button 
              variant="danger" 
              onClick={() => handleStatusChange('Revoked')}
              isLoading={updating}
            >
              Revoke Contract
            </Button>
          )}
        </div>
      </header>

      {/* Progress Stepper */}
      <StatusStepper currentStatus={contract.status} />

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('document')}
          className={`tab-button ${activeTab === 'document' ? 'active' : ''}`}
        >
          Document View
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
        >
          Field Data
        </button>
      </div>

      {activeTab === 'document' ? (
        <div>
          {blueprint.contentTemplate ? (
            <ContractDocument 
              template={blueprint.contentTemplate} 
              values={contract.values} 
              blueprint={blueprint}
            />
          ) : (
            <Card>
              <p className="text-muted no-template-msg">
                No document template available for this blueprint.
              </p>
            </Card>
          )}
        </div>
      ) : (
        <Card title="Contract Details">
          <p className="text-muted">Template: {contract.blueprintName}</p>
          <p className="text-muted">Created: {new Date(contract.createdAt).toLocaleString()}</p>

          <div className="fields-grid">
            {blueprint.fields.map(field => (
              <div key={field.id} className="field-item">
                <strong className="field-label-display">
                  {field.label}
                </strong>
                <div className="field-value">
                  {field.type === 'checkbox' ? (
                    contract.values[field.id] ? 'Yes' : 'No'
                  ) : (
                    contract.values[field.id] || '-'
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
