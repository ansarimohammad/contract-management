import { v4 as uuidv4 } from 'uuid';
import type { Blueprint, Contract, ContractStatus } from '../types';

const STORAGE_KEYS = {
  BLUEPRINTS: 'contract_platform_blueprints',
  CONTRACTS: 'contract_platform_contracts',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get data
const getStoredData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to set data
const setStoredData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storageService = {
  // Blueprints
  async getBlueprints(): Promise<Blueprint[]> {
    await delay(500);
    return getStoredData<Blueprint>(STORAGE_KEYS.BLUEPRINTS);
  },

  async getBlueprint(id: string): Promise<Blueprint | undefined> {
    await delay(300);
    const blueprints = getStoredData<Blueprint>(STORAGE_KEYS.BLUEPRINTS);
    return blueprints.find((b) => b.id === id);
  },

  async saveBlueprint(blueprint: Omit<Blueprint, 'id' | 'createdAt'>): Promise<Blueprint> {
    await delay(600);
    const blueprints = getStoredData<Blueprint>(STORAGE_KEYS.BLUEPRINTS);
    const newBlueprint: Blueprint = {
      ...blueprint,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    blueprints.push(newBlueprint);
    setStoredData(STORAGE_KEYS.BLUEPRINTS, blueprints);
    return newBlueprint;
  },

  // Contracts
  async getContracts(): Promise<Contract[]> {
    await delay(500);
    return getStoredData<Contract>(STORAGE_KEYS.CONTRACTS);
  },

  async getContract(id: string): Promise<Contract | undefined> {
    await delay(300);
    const contracts = getStoredData<Contract>(STORAGE_KEYS.CONTRACTS);
    return contracts.find((c) => c.id === id);
  },

  async createContract(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Contract> {
    await delay(600);
    const contracts = getStoredData<Contract>(STORAGE_KEYS.CONTRACTS);
    const newContract: Contract = {
      ...data,
      id: uuidv4(),
      status: 'Created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contracts.push(newContract);
    setStoredData(STORAGE_KEYS.CONTRACTS, contracts);
    return newContract;
  },

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    await delay(400);
    const contracts = getStoredData<Contract>(STORAGE_KEYS.CONTRACTS);
    const index = contracts.findIndex((c) => c.id === id);
    
    if (index === -1) throw new Error('Contract not found');

    const updatedContract = {
      ...contracts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    contracts[index] = updatedContract;
    setStoredData(STORAGE_KEYS.CONTRACTS, contracts);
    return updatedContract;
  },
  
  async updateContractStatus(id: string, status: ContractStatus): Promise<Contract> {
      return this.updateContract(id, { status });
  }
};
