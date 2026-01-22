export type FieldType = 'text' | 'date' | 'signature' | 'checkbox';

export interface FieldDefinition {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  x: number; // For basic positioning
  y: number;
}

export interface Blueprint {
  id: string;
  name: string;
  description?: string;
  contentTemplate?: string; // Markdown/Text template with {{fieldId}} placeholders
  fields: FieldDefinition[];
  createdAt: string;
}

export type ContractStatus = 'Created' | 'Approved' | 'Sent' | 'Signed' | 'Locked' | 'Revoked';

export interface ContractField {
  fieldId: string;
  value: string | boolean; // signature will be a string (data URL or name)
}

export interface Contract {
  id: string;
  blueprintId: string;
  blueprintName: string;
  name: string;
  status: ContractStatus;
  values: Record<string, any>; // Map fieldId to value
  createdAt: string;
  updatedAt: string;
}
