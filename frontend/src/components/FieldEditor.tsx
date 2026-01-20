import React from 'react';
import type { FieldDefinition } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface FieldEditorProps {
  field: FieldDefinition;
  onChange: (updates: Partial<FieldDefinition>) => void;
  onDelete: () => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, onChange, onDelete }) => {
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>{field.type.toUpperCase()} Field</strong>
        <Button onClick={onDelete} variant="danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
          Remove
        </Button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Input
          label="Label"
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <Input
            type="number"
            label="X Position"
            value={field.x}
            onChange={(e) => onChange({ x: Number(e.target.value) })}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            type="number"
            label="Y Position"
            value={field.y}
            onChange={(e) => onChange({ y: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange({ required: e.target.checked })}
          />
          Required Field
        </label>
      </div>
    </Card>
  );
};
