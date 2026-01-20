import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import type { FieldDefinition, FieldType } from '../types';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

interface DraggableFieldProps {
  field: FieldDefinition;
  isSelected: boolean;
  onSelect: () => void;
  onDragStop: (x: number, y: number) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, isSelected, onSelect, onDragStop }) => {
  const nodeRef = React.useRef(null);
  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: field.x, y: field.y }}
      onStop={(_, data) => onDragStop(data.x, data.y)}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        onClick={onSelect}
        style={{
          position: 'absolute',
          border: isSelected ? '2px solid var(--primary)' : '1px solid #ccc',
          background: 'white',
          padding: '8px',
          borderRadius: '4px',
          cursor: 'grab',
          minWidth: '150px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          zIndex: isSelected ? 10 : 1
        }}
      >
        <div style={{ fontSize: '12px', color: '#666' }}>{field.label} {field.required && '*'}</div>
        <div style={{ 
          height: '30px', background: '#eee', marginTop: '4px', borderRadius: '4px' 
        }} />
      </div>
    </Draggable>
  );
};

export const BlueprintBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addField = (type: FieldType, x?: number, y?: number) => {
    const newField: FieldDefinition = {
      id: uuidv4(),
      type,
      label: `New ${type} field`,
      required: false,
      x: x ?? 20,
      y: y ?? fields.length * 60 + 20, // Simple auto-layout or custom position
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FieldDefinition>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleDragStop = (id: string, x: number, y: number) => {
    updateField(id, { x, y });
  };

  const handleSidebarDragStart = (e: React.DragEvent, type: FieldType) => {
    e.dataTransfer.setData('fieldType', type);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('fieldType') as FieldType;
    if (type) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      // Adjust for scroll if needed, but since we are dropping on the div which might scroll, 
      // getting coordinates relative to the viewport (clientX) minus the element's position (rect) is usually correct for "offset within element".
      // However, if the user scrolled down in the canvas, we might need to account for scrollTop.
      // Let's check if e.currentTarget is the scrolling container. 
      // In the JSX, the Card has overflow:auto, but we are attaching handlers to the inner div (height: 1000px).
      // So e.currentTarget is the inner div.
      // The inner div doesn't scroll itself, its parent does. 
      // So (clientX - rect.left) gives position relative to the top-left of the inner div (which is what we want for absolute positioning).
      
      addField(type, x, y);
    }
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert('Please enter a blueprint name');
    if (fields.length === 0) return alert('Please add at least one field');

    setIsSaving(true);
    try {
      await storageService.saveBlueprint({
        name,
        fields,
      });
      alert('Blueprint saved successfully!');
      navigate('/'); // Go back to dashboard
    } catch (error) {
      console.error(error);
      alert('Failed to save blueprint');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px - 64px)', padding: 0 }}>
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button onClick={() => navigate('/')}>← Back</Button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Create Blueprint</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Input
            placeholder="Blueprint Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '250px', marginBottom: 0 }}
          />
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
            Save Blueprint
          </Button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, gap: '24px', overflow: 'hidden' }}>
        {/* Left Sidebar: Tools */}
        <Card style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '10px' }} title="Fields">
          <div draggable onDragStart={(e) => handleSidebarDragStart(e, 'text')}>
            <Button style={{ width: '100%' }} onClick={() => addField('text')}>+ Text</Button>
          </div>
          <div draggable onDragStart={(e) => handleSidebarDragStart(e, 'date')}>
            <Button style={{ width: '100%' }} onClick={() => addField('date')}>+ Date</Button>
          </div>
          <div draggable onDragStart={(e) => handleSidebarDragStart(e, 'checkbox')}>
            <Button style={{ width: '100%' }} onClick={() => addField('checkbox')}>+ Checkbox</Button>
          </div>
          <div draggable onDragStart={(e) => handleSidebarDragStart(e, 'signature')}>
            <Button style={{ width: '100%' }} onClick={() => addField('signature')}>+ Signature</Button>
          </div>
        </Card>

        {/* Center: Canvas */}
        <Card style={{ flex: 1, position: 'relative', background: '#f9fafb', overflow: 'auto', padding: 0 }}>
          <div style={{ 
            width: '100%', height: '1000px', // Large canvas
            position: 'relative' 
          }}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          >
            {fields.map((field) => (
              <DraggableField
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onSelect={() => setSelectedFieldId(field.id)}
                onDragStop={(x, y) => handleDragStop(field.id, x, y)}
              />
            ))}
          </div>
        </Card>

        
       
      </div>
    </div>
  );
};
