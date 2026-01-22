import React from 'react';
import { Card } from '../ui/Card/Card';
import type { Blueprint } from '../../types';
import './ContractDocument.css';

interface ContractDocumentProps {
  template: string;
  values: Record<string, any>;
  blueprint?: Blueprint; // Added to lookup fields by label
}

export const ContractDocument: React.FC<ContractDocumentProps> = ({ template, values, blueprint }) => {
  // Regex to replace {{Field Label}} or {{fieldId}}
  const renderedContent = template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
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
    <Card className="contract-doc">
      <div className="doc-content">
        {renderedContent}
      </div>
    </Card>
  );
};
