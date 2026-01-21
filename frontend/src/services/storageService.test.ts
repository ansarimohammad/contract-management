import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create and retrieve blueprints', async () => {
    const blueprint = await storageService.saveBlueprint({
      name: 'Test Blueprint',
      fields: []
    });

    expect(blueprint.id).toBeDefined();
    expect(blueprint.name).toBe('Test Blueprint');

    const stored = await storageService.getBlueprint(blueprint.id);
    expect(stored).toBeDefined();
    expect(stored?.name).toBe('Test Blueprint');
  });

  it('should create and retrieve contracts', async () => {
    const contract = await storageService.createContract({
      blueprintId: 'bp-1',
      blueprintName: 'Test BP',
      name: 'Test Contract',
      values: {}
    });

    expect(contract.id).toBeDefined();
    expect(contract.status).toBe('Created');

    const stored = await storageService.getContract(contract.id);
    expect(stored).toBeDefined();
    expect(stored?.name).toBe('Test Contract');
  });

  it('should update contract status', async () => {
    const contract = await storageService.createContract({
      blueprintId: 'bp-1',
      blueprintName: 'Test BP',
      name: 'Test Contract',
      values: {}
    });

    const updated = await storageService.updateContractStatus(contract.id, 'Approved');
    expect(updated.status).toBe('Approved');

    const stored = await storageService.getContract(contract.id);
    expect(stored?.status).toBe('Approved');
  });
});
