import { v4 as uuidv4 } from 'uuid';
import type { Blueprint, Contract } from '../types';

const NDA_BP_ID = uuidv4();
const EMPLOYMENT_BP_ID = uuidv4();

// Pre-define field IDs to map values correctly
const ndaFields = {
  disclosingParty: uuidv4(),
  receivingParty: uuidv4(),
  effectiveDate: uuidv4(),
  nonSolicit: uuidv4(),
  sigDisclosing: uuidv4(),
  sigReceiving: uuidv4(),
};

const empFields = {
  employeeName: uuidv4(),
  roleTitle: uuidv4(),
  startDate: uuidv4(),
  salary: uuidv4(),
  remote: uuidv4(),
  sigEmployee: uuidv4(),
};

export const MOCK_BLUEPRINTS: Blueprint[] = [
  {
    id: NDA_BP_ID,
    name: 'Standard Non-Disclosure Agreement',
    description: 'Mutual NDA for business discussions.',
    contentTemplate: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into by and between {{${ndaFields.disclosingParty}}} ("Disclosing Party") and {{${ndaFields.receivingParty}}} ("Receiving Party") for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below.

1. Definition of Confidential Information. For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.

2. Obligations of Receiving Party. Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of Disclosing Party.

3. Effective Date. This Agreement shall be effective as of {{${ndaFields.effectiveDate}}}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

Disclosing Party:
{{${ndaFields.sigDisclosing}}}

Receiving Party:
{{${ndaFields.sigReceiving}}}`,
    createdAt: new Date().toISOString(),
    fields: [
      { id: ndaFields.disclosingParty, type: 'text', label: 'Disclosing Party', required: true, x: 20, y: 20 },
      { id: ndaFields.receivingParty, type: 'text', label: 'Receiving Party', required: true, x: 300, y: 20 },
      { id: ndaFields.effectiveDate, type: 'date', label: 'Effective Date', required: true, x: 20, y: 100 },
      { id: ndaFields.nonSolicit, type: 'checkbox', label: 'Include Non-Solicit Clause', required: false, x: 20, y: 180 },
      { id: ndaFields.sigDisclosing, type: 'signature', label: 'Signature (Disclosing)', required: true, x: 20, y: 300 },
      { id: ndaFields.sigReceiving, type: 'signature', label: 'Signature (Receiving)', required: true, x: 300, y: 300 },
    ],
  },
  {
    id: EMPLOYMENT_BP_ID,
    name: 'Employment Contract',
    description: 'Standard full-time employment agreement.',
    contentTemplate: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made and entered into between Company Inc. ("Employer") and {{${empFields.employeeName}}} ("Employee").

1. Position. Employee is being hired for the position of {{${empFields.roleTitle}}}.

2. Start Date. Employee's employment with Employer shall commence on {{${empFields.startDate}}}.

3. Compensation. Employee shall be paid a base salary of {{${empFields.salary}}} per year, payable in accordance with Employer's standard payroll schedule.

4. Remote Work.
Remote Position: {{${empFields.remote}}}

IN WITNESS WHEREOF, the parties have executed this Agreement.

Employee Signature:
{{${empFields.sigEmployee}}}`,
    createdAt: new Date().toISOString(),
    fields: [
      { id: empFields.employeeName, type: 'text', label: 'Employee Name', required: true, x: 20, y: 20 },
      { id: empFields.roleTitle, type: 'text', label: 'Role Title', required: true, x: 300, y: 20 },
      { id: empFields.startDate, type: 'date', label: 'Start Date', required: true, x: 20, y: 100 },
      { id: empFields.salary, type: 'text', label: 'Annual Salary', required: true, x: 300, y: 100 },
      { id: empFields.remote, type: 'checkbox', label: 'Remote Position', required: false, x: 20, y: 180 },
      { id: empFields.sigEmployee, type: 'signature', label: 'Employee Signature', required: true, x: 20, y: 300 },
    ],
  },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: uuidv4(),
    blueprintId: NDA_BP_ID,
    blueprintName: 'Standard Non-Disclosure Agreement',
    name: 'NDA with Acme Corp',
    status: 'Signed',
    values: {
      [ndaFields.disclosingParty]: 'My Company Inc.',
      [ndaFields.receivingParty]: 'Acme Corp',
      [ndaFields.effectiveDate]: '2023-10-01',
      [ndaFields.nonSolicit]: true,
      [ndaFields.sigDisclosing]: 'John CEO',
      [ndaFields.sigReceiving]: 'Alice Acme',
    },
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    blueprintId: EMPLOYMENT_BP_ID,
    blueprintName: 'Employment Contract',
    name: 'Offer Letter - Jane Doe',
    status: 'Sent',
    values: {
      [empFields.employeeName]: 'Jane Doe',
      [empFields.roleTitle]: 'Senior Engineer',
      [empFields.startDate]: '2023-11-15',
      [empFields.salary]: '$140,000',
      [empFields.remote]: true,
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    blueprintId: NDA_BP_ID,
    blueprintName: 'Standard Non-Disclosure Agreement',
    name: 'NDA with StartupX',
    status: 'Created',
    values: {
      [ndaFields.disclosingParty]: 'My Company Inc.',
      [ndaFields.receivingParty]: 'StartupX',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    blueprintId: EMPLOYMENT_BP_ID,
    blueprintName: 'Employment Contract',
    name: 'Offer Letter - Bob Smith',
    status: 'Approved',
    values: {
      [empFields.employeeName]: 'Bob Smith',
      [empFields.roleTitle]: 'Product Manager',
      [empFields.startDate]: '2023-12-01',
      [empFields.salary]: '$130,000',
      [empFields.remote]: false,
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    blueprintId: NDA_BP_ID,
    blueprintName: 'Standard Non-Disclosure Agreement',
    name: 'NDA with VendorY (Revoked)',
    status: 'Revoked',
    values: {
      [ndaFields.disclosingParty]: 'My Company Inc.',
      [ndaFields.receivingParty]: 'VendorY',
      [ndaFields.effectiveDate]: '2023-09-01',
    },
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    blueprintId: EMPLOYMENT_BP_ID,
    blueprintName: 'Employment Contract',
    name: 'Contract - Alice Wonder (Locked)',
    status: 'Locked',
    values: {
      [empFields.employeeName]: 'Alice Wonder',
      [empFields.roleTitle]: 'Designer',
      [empFields.startDate]: '2023-01-10',
      [empFields.salary]: '$110,000',
      [empFields.remote]: true,
      [empFields.sigEmployee]: 'Alice Wonder',
    },
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
