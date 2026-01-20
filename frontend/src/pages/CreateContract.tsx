import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Blueprint } from '../types';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const CreateContract: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const blueprintId = searchParams.get('blueprintId');

  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);

  const [contractName, setContractName] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const data = await storageService.getBlueprints();
        setBlueprints(data);

        if (blueprintId) {
          const found = data.find(b => b.id === blueprintId);
          if (found) setSelectedBlueprint(found);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlueprints();
  }, [blueprintId]);

  const handleBlueprintSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const found = blueprints.find(b => b.id === id);
    setSelectedBlueprint(found || null);
    setFormData({}); // Reset form when blueprint changes
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlueprint || !contractName.trim()) return;

    // Validate required fields
    const missingFields = selectedBlueprint.fields.filter(f => f.required && !formData[f.id]);
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      await storageService.createContract({
        blueprintId: selectedBlueprint.id,
        blueprintName: selectedBlueprint.name,
        name: contractName,
        values: formData,
      });
      alert('Contract created successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to create contract');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ padding: 0 }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Button onClick={() => navigate('/')} style={{ marginRight: '16px' }}>← Back</Button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Create New Contract</h1>
      </header>

      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        {!selectedBlueprint ? (
          <div>
            <label className="label">Select a Blueprint Template</label>
            <select
              className="input"
              onChange={handleBlueprintSelect}
              defaultValue=""
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb' }}
            >
              <option value="" disabled>-- Choose a template --</option>
              {blueprints.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <h3>Template: {selectedBlueprint.name}</h3>
              <Button
                variant="secondary"
                onClick={() => setSelectedBlueprint(null)}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                Change Template
              </Button>
            </div>

            <Input
              label="Contract Name"
              required
              value={contractName}
              onChange={e => setContractName(e.target.value)}
              placeholder="e.g., NDA for John Doe"
            />

            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
              {selectedBlueprint.fields
                .sort((a, b) => a.y - b.y) // Sort by Y position roughly
                .map(field => (
                  <div key={field.id}>
                    {field.type === 'text' && (
                      <Input
                        label={field.label}
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === 'date' && (
                      <Input
                        type="date"
                        label={field.label}
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === 'checkbox' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <input
                          type="checkbox"
                          checked={!!formData[field.id]}
                          onChange={e => handleInputChange(field.id, e.target.checked)}
                          id={field.id}
                        />
                        <label htmlFor={field.id} style={{ fontSize: '14px', fontWeight: 500 }}>{field.label}</label>
                      </div>
                    )}

                    {field.type === 'signature' && (
                      <Input
                        label={field.label}
                        required={field.required}
                        placeholder="Type name to sign (simulated)"
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        style={{ fontFamily: 'cursive' }}
                      />
                    )}
                  </div>
                ))}
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary" isLoading={submitting}>
                Create Contract
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
