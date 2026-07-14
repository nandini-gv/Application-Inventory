import type { IApplicationProvider } from './IApplicationProvider';
import { MockApplicationProvider } from './MockApplicationProvider';
import type { Application } from '../types';

// Orchestrator delegating execution to the active provider instance.
// Swapping Mock persistence with SharePoint Online REST integration
// only requires changing the activeProvider instance here.
const activeProvider: IApplicationProvider = new MockApplicationProvider();

export const ApplicationService = {
  getApplications: (): Promise<Application[]> => {
    return activeProvider.getApplications();
  },

  getApplicationById: (id: string): Promise<Application | null> => {
    return activeProvider.getApplicationById(id);
  },

  createApplication: (
    app: Omit<Application, 'id' | 'lastUpdated' | 'history'>
  ): Promise<Application> => {
    return activeProvider.createApplication(app);
  },

  updateApplication: (id: string, app: Partial<Application>): Promise<Application> => {
    return activeProvider.updateApplication(id, app);
  },

  deleteApplication: (id: string): Promise<boolean> => {
    return activeProvider.deleteApplication(id);
  },
};
