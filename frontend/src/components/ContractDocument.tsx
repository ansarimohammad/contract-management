import React from 'react';
import { Card } from './ui/Card';
import type { Blueprint } from '../types';

interface ContractDocumentProps {
  template: string;
  values: Record<string, any>;
  blueprint?: Blueprint; // Added to lookup fields by label
}

export const ContractDocument: React.FC<ContractDocumentProps> = ({ template, values, blueprint }) => {
  // Regex to replace {{Field Label}} or {{fieldId}}
  const renderedContent = template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    
    // 1. Try to find field by ID directly
    let value = values[trimmedKey];

    // 2. If not found, try to find field by Label (case-insensitive? Let's do exact match first)
    if (value === undefined && blueprint) {
      const field = blueprint.fields.find(f => f.label === trimmedKey || f.id === trimmedKey);
      if (field) {
        value = values[field.id];
      }
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return value ? '[x] Yes' : '[ ] No';
    }
    
    // Handle missing/empty values
    if (value === undefined || value === null || value === '') {
      return '____________________';
    }

    return String(value);
  });

  return (
    <Card style={{ 
      background: 'white', 
      padding: '40px', 
      minHeight: '600px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#000',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {renderedContent}
      </div>
    </Card>
  );
};
