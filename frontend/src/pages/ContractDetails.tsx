import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Contract, Blueprint, ContractStatus } from '../types';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatusStepper } from '../components/ui/StatusStepper';
import { ContractDocument } from '../components/ContractDocument';

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
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button onClick={() => navigate('/')}>← Back</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{contract.name}</h1>
            <Badge status={contract.status} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
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
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('document')}
          style={{
            padding: '10px 0',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'document' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'document' ? 'var(--primary)' : '#6b7280',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Document View
        </button>
        <button
          onClick={() => setActiveTab('details')}
          style={{
            padding: '10px 0',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'details' ? 'var(--primary)' : '#6b7280',
            fontWeight: 500,
            cursor: 'pointer'
          }}
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
              <p className="text-muted" style={{ textAlign: 'center', padding: '40px' }}>
                No document template available for this blueprint.
              </p>
            </Card>
          )}
        </div>
      ) : (
        <Card title="Contract Details">
          <p className="text-muted">Template: {contract.blueprintName}</p>
          <p className="text-muted">Created: {new Date(contract.createdAt).toLocaleString()}</p>

          <div style={{ marginTop: '20px', display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
            {blueprint.fields.map(field => (
              <div key={field.id} style={{ padding: '10px', background: '#f9fafb', borderRadius: '4px' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {field.label}
                </strong>
                <div style={{ fontSize: '16px' }}>
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
