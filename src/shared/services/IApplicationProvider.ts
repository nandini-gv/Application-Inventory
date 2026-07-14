import type { Application } from '../types';

export interface IApplicationProvider {
  getApplications(): Promise<Application[]>;
  getApplicationById(id: string): Promise<Application | null>;
  createApplication(app: Omit<Application, 'id' | 'lastUpdated' | 'history'>): Promise<Application>;
  updateApplication(id: string, app: Partial<Application>): Promise<Application>;
  deleteApplication(id: string): Promise<boolean>;
}
