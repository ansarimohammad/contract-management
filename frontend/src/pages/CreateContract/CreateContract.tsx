import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Blueprint } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Card } from '../../components/ui/Card/Card';
import './CreateContract.css';

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
      <header className="create-header">
        <Button onClick={() => navigate('/')} style={{ marginRight: '16px' }}>← Back</Button>
        <h1 className="create-title">Create New Contract</h1>
      </header>

      <Card className="create-form-container">
        {!selectedBlueprint ? (
          <div>
            <label className="label">Select a Blueprint Template</label>
            <select 
              className="template-selector" 
              onChange={handleBlueprintSelect} 
              defaultValue=""
            >
              <option value="" disabled>-- Choose a template --</option>
              {blueprints.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="template-header">
              <h3 className="template-name">Template: {selectedBlueprint.name}</h3>
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

            <div className="form-grid">
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
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={!!formData[field.id]}
                        onChange={e => handleInputChange(field.id, e.target.checked)}
                        id={field.id}
                      />
                      <label htmlFor={field.id} className="checkbox-label">{field.label}</label>
                    </div>
                  )}

                  {field.type === 'signature' && (
                    <Input
                      label={field.label}
                      required={field.required}
                      placeholder="Type name to sign (simulated)"
                      value={formData[field.id] || ''}
                      onChange={e => handleInputChange(field.id, e.target.value)}
                      className="signature-input"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
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
