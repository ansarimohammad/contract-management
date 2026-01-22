import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import type { FieldDefinition, FieldType } from '../../types';
import { FieldEditor } from '../../components/FieldEditor';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Card } from '../../components/ui/Card/Card';
import './BlueprintBuilder.css';

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
        className={`draggable-field ${isSelected ? 'selected' : ''}`}
      >
        <div className="field-label">{field.label} {field.required && '*'}</div>
        <div className="field-placeholder" />
      </div>
    </Draggable>
  );
};

export const BlueprintBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [contentTemplate, setContentTemplate] = useState('');
  const [viewMode, setViewMode] = useState<'fields' | 'template'>('fields');
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
        contentTemplate,
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
    <div className="container builder-container">
      <header className="builder-header">
        <div className="builder-header-left">
          <Button onClick={() => navigate('/')}>← Back</Button>
          <h1 className="builder-title">Create Blueprint</h1>
        </div>
        <div className="builder-header-right">
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

      <div className="builder-workspace">
        {/* Left Sidebar: Tools */}
        <Card className="tools-sidebar" title="Tools">
          <div className="tools-mode-switch">
             <Button 
               variant={viewMode === 'fields' ? 'primary' : 'secondary'} 
               onClick={() => setViewMode('fields')}
             >
               Fields Design
             </Button>
             <Button 
               variant={viewMode === 'template' ? 'primary' : 'secondary'} 
               onClick={() => setViewMode('template')}
             >
               Document Template
             </Button>
          </div>

          {viewMode === 'fields' && (
            <div className="tools-list">
              <strong className="tools-section-title">DRAG TO CANVAS</strong>
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
            </div>
          )}
          
          {viewMode === 'template' && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <strong>Available Variables:</strong>
              <div className="variable-list">
                {fields.map(f => (
                  <div 
                    key={f.id} 
                    className="variable-item"
                    onClick={() => setContentTemplate(prev => prev + `{{${f.label}}}`)}
                    title="Click to insert"
                  >
                    {`{{${f.label}}}`}
                  </div>
                ))}
                {fields.length === 0 && <span>No fields added yet.</span>}
              </div>
            </div>
          )}
        </Card>

        {/* Center: Canvas or Template Editor */}
        <Card className={`canvas-area ${viewMode === 'fields' ? 'canvas-bg' : 'template-bg'}`} style={{ padding: viewMode === 'template' ? '20px' : 0 }}>
          {viewMode === 'fields' ? (
            <div 
              className="canvas-content"
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
          ) : (
            <div className="template-editor">
              <div style={{ marginBottom: '10px', color: '#666' }}>
                Write your contract text below. Use <code>{`{{Field Label}}`}</code> to insert dynamic values.
              </div>
              <textarea
                value={contentTemplate}
                onChange={(e) => setContentTemplate(e.target.value)}
                className="template-textarea"
                placeholder="Enter contract agreement text here..."
              />
            </div>
          )}
        </Card>

        {/* Right Sidebar: Properties (only visible in fields mode) */}
        {viewMode === 'fields' && (
          <div className="properties-sidebar">
            {selectedField ? (
              <FieldEditor
                field={selectedField}
                onChange={(updates) => updateField(selectedField.id, updates)}
                onDelete={() => deleteField(selectedField.id)}
              />
            ) : (
              <Card style={{ color: '#888', textAlign: 'center' }}>
                Select a field to edit properties
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
