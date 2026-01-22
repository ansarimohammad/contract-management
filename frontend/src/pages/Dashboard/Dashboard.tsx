import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Blueprint, Contract, ContractStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Badge } from '../../components/ui/Badge/Badge';
import './Dashboard.css';

const STATUS_ORDER: ContractStatus[] = ['Created', 'Approved', 'Sent', 'Signed', 'Locked'];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadData = async () => {
    try {
      const [bp, ct] = await Promise.all([
        storageService.getBlueprints(),
        storageService.getContracts()
      ]);
      setBlueprints(bp);
      setContracts(ct);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedData = async () => {
    if (confirm('This will overwrite existing data with demo data. Continue?')) {
      setSeeding(true);
      try {
        await storageService.seedMockData();
        await loadData(); // Reload to show new data
      } catch (error) {
        console.error(error);
        alert('Failed to seed data');
      } finally {
        setSeeding(false);
      }
    }
  };

  const handleQuickStatusChange = async (e: React.MouseEvent, contract: Contract) => {
    e.stopPropagation();
    const currentIdx = STATUS_ORDER.indexOf(contract.status);
    if (currentIdx >= STATUS_ORDER.length - 1) return;
    
    const nextStatus = STATUS_ORDER[currentIdx + 1];
    if (confirm(`Update status to ${nextStatus}?`)) {
      try {
        await storageService.updateContractStatus(contract.id, nextStatus);
        loadData(); // Reload data
      } catch (error) {
        alert('Failed to update');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Contract Dashboard</h1>
        <div className="dashboard-actions">
          <Button variant="ghost" onClick={handleSeedData} isLoading={seeding}>
            🌱 Seed Data
          </Button>
          <Button variant="primary" onClick={() => navigate('/blueprints/new')}>
            + New Blueprint
          </Button>
          <Button variant="secondary" onClick={() => navigate('/contracts/new')}>
            + New Contract
          </Button>
        </div>
      </header>

      <section className="dashboard-section">
        <h2 className="section-title">Active Contracts</h2>
        {contracts.length === 0 ? (
          <p className="text-muted">No contracts found.</p>
        ) : (
          <Card className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blueprint</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.blueprintName}</td>
                    <td>
                      <Badge status={c.status} />
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <Button onClick={() => navigate(`/contracts/${c.id}`)}>View</Button>
                      
                      {c.status !== 'Locked' && c.status !== 'Revoked' && (
                        <Button 
                          variant="primary" 
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                          onClick={(e) => handleQuickStatusChange(e, c)}
                        >
                          Advance
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Available Blueprints</h2>
        <div className="blueprints-grid">
          {blueprints.map((b) => (
            <Card key={b.id} title={b.name}>
              <p className="text-muted" style={{ marginTop: 0 }}>{b.fields.length} fields</p>
              <Button style={{ marginTop: '10px', width: '100%' }} onClick={() => navigate('/contracts/new?blueprintId=' + b.id)}>
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
