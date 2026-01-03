import { MOCK_USERS, MOCK_JOBS, MOCK_TOOLS, MOCK_WORKERS, MOCK_BOOKINGS, MOCK_WALLET_DATA, MOCK_REVIEWS } from '../utils/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const base44 = {
  auth: {
    me: async () => {
      await delay(300);
      return { ...MOCK_USERS[0], email: MOCK_USERS[0].user_email };
    },
    logout: async () => {
      console.log("Logged out");
      window.location.href = "/";
    },
    redirectToLogin: () => {
        console.log("Redirect to login requested");
    }
  },
  entities: {
    UserProfile: {
      filter: async (query: any) => {
        await delay(300);
        let results = [...MOCK_USERS];
        if (query.id) results = results.filter(u => u.id === query.id);
        if (query.user_email) results = results.filter(u => u.user_email === query.user_email);
        if (query.user_type) results = results.filter(u => u.user_type === query.user_type);
        return results;
      },
      update: async (id: string, data: any) => {
        console.log("Updating profile", id, data);
        return data;
      },
      create: async (data: any) => {
        console.log("Creating profile", data);
        return data;
      }
    },
    Job: {
        filter: async (query: any) => {
            await delay(300);
             if (query.id) return MOCK_JOBS.filter(j => j.id === query.id);
             if (query.farmer_id) return MOCK_JOBS.filter(j => j.postedBy.id === query.farmer_id);
             if (query.assigned_worker_id) return MOCK_JOBS.filter(j => j.assigned_worker_id === query.assigned_worker_id);
            return MOCK_JOBS;
        },
        create: async (data: any) => { console.log("Create job", data); return data; }
    },
    Tool: {
        list: async () => { await delay(300); return MOCK_TOOLS; },
        filter: async (query: any) => {
            await delay(300);
            if(query.id) return MOCK_TOOLS.filter(t => t.id === query.id);
            if(query.owner_id) return MOCK_TOOLS.filter(t => t.owner.id === query.owner_id);
            return MOCK_TOOLS;
        }
    },
    Transaction: {
        filter: async () => { await delay(300); return []; },
        create: async (data: any) => { console.log("Create tx", data); return data; }
    },
    Review: {
        filter: async (query: any) => { 
          await delay(300); 
          let results = [...MOCK_REVIEWS];
          if(query.tool_id) results = results.filter(r => r.tool_id === query.tool_id);
          if(query.reviewed_user_id) results = results.filter(r => r.reviewed_user_id === query.reviewed_user_id);
          return results;
        }
    },
    ToolBooking: {
        create: async (data: any) => { console.log("Booking", data); return data; }
    },
    Notification: {
        create: async (data: any) => { console.log("Notif", data); return data; }
    }
  },
  integrations: {
    Core: {
        UploadFile: async ({ file }: any) => {
            await delay(500);
            return { file_url: URL.createObjectURL(file) };
        }
    }
  }
};