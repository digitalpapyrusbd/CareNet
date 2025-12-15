import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define the shape of our global state
interface AppState {
  user: {
    profile: any | null;
    loading: boolean;
  };
  notifications: {
    items: any[];
    unreadCount: number;
  };
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
  };
}

// Define action types
type AppAction =
  | { type: 'SET_USER_PROFILE'; payload: any }
  | { type: 'SET_USER_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' };

// Initial state
const initialState: AppState = {
  user: {
    profile: null,
    loading: false,
  },
  notifications: {
    items: [],
    unreadCount: 0,
  },
  ui: {
    sidebarOpen: false,
    theme: 'light',
  },
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload,
        },
      };

    case 'SET_USER_LOADING':
      return {
        ...state,
        user: {
          ...state.user,
          loading: action.payload,
        },
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: {
          items: [action.payload, ...state.notifications.items],
          unreadCount: state.notifications.unreadCount + 1,
        },
      };

    case 'REMOVE_NOTIFICATION':
      const updatedItems = state.notifications.items.filter(
        item => item.id !== action.payload
      );
      return {
        ...state,
        notifications: {
          items: updatedItems,
          unreadCount: updatedItems.filter(item => !item.read).length,
        },
      };

    case 'MARK_NOTIFICATION_READ':
      const itemsAfterRead = state.notifications.items.map(item =>
        item.id === action.payload ? { ...item, read: true } : item
      );
      return {
        ...state,
        notifications: {
          items: itemsAfterRead,
          unreadCount: itemsAfterRead.filter(item => !item.read).length,
        },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return React.createElement(
    AppContext.Provider,
    { value: { state, dispatch } },
    children
  );
}

// Hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Action creators
export const appActions = {
  setUserProfile: (profile: any) => ({
    type: 'SET_USER_PROFILE' as const,
    payload: profile,
  }),

  setUserLoading: (loading: boolean) => ({
    type: 'SET_USER_LOADING' as const,
    payload: loading,
  }),

  addNotification: (notification: any) => ({
    type: 'ADD_NOTIFICATION' as const,
    payload: notification,
  }),

  removeNotification: (id: string) => ({
    type: 'REMOVE_NOTIFICATION' as const,
    payload: id,
  }),

  markNotificationRead: (id: string) => ({
    type: 'MARK_NOTIFICATION_READ' as const,
    payload: id,
  }),

  toggleSidebar: () => ({
    type: 'TOGGLE_SIDEBAR' as const,
  }),

  setTheme: (theme: 'light' | 'dark') => ({
    type: 'SET_THEME' as const,
    payload: theme,
  }),
};

// Selectors for accessing specific parts of the state
export const appSelectors = {
  getUserProfile: (state: AppState) => state.user.profile,
  getUserLoading: (state: AppState) => state.user.loading,
  getNotifications: (state: AppState) => state.notifications.items,
  getUnreadCount: (state: AppState) => state.notifications.unreadCount,
  getSidebarOpen: (state: AppState) => state.ui.sidebarOpen,
  getTheme: (state: AppState) => state.ui.theme,
};