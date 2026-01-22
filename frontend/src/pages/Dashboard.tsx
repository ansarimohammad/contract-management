import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Blueprint, Contract, ContractStatus } from '../types';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

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
    <div className="container" style={{ padding: 0 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Contract Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
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

      <section style={{ marginBottom: '40px' }}>
        <h2>Active Contracts</h2>
        {contracts.length === 0 ? (
          <p className="text-muted">No contracts found.</p>
        ) : (
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Blueprint</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '10px' }}>{c.name}</td>
                    <td style={{ padding: '10px' }}>{c.blueprintName}</td>
                    <td style={{ padding: '10px' }}>
                      <Badge status={c.status} />
                    </td>
                    <td style={{ padding: '10px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
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

      <section>
        <h2>Available Blueprints</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {blueprints.map((b) => (
            <Card key={b.id} title={b.name}>
              <p style={{ color: '#666', marginTop: 0 }}>{b.fields.length} fields</p>
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
