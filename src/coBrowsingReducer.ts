import { CoBrowsing, Session } from './cobrowsing/serialization';

export enum CO_BROWSING_REDUCER {
  BROWSING = 0,
  URL,
  SESSION,
  TOOL_CHANGE,
  SHOW_TOOLS,
  SHOW_SETTINGS,
  SAME_USER_SCREEN_SIZE,
  SESSION_START,
  SESSION_KEY,
  SHOW_HISTORY,
}

export enum TOOL_USING {
  MOUSE = 0,
  PENCIL,
  BRUSH,
  RECTANGLE,
}

export interface coBrowsingReducerInterface {
  session: Session | null;
  currentURL: string;
  showTools: boolean;
  selectedTool: TOOL_USING;
  showSettings: boolean;
  sameUserScreenSize: boolean;
  startedSession: boolean;
  sessionKey: string;
  showHistory: boolean;
}

export const coBrowsingReducer = (
  state: coBrowsingReducerInterface,
  action: { type: CO_BROWSING_REDUCER; payload: Partial<coBrowsingReducerInterface> }
): coBrowsingReducerInterface => {
  switch (action.type) {
    case CO_BROWSING_REDUCER.SESSION: {
      if (action.payload.session) {
        return { ...state, session: action.payload.session };
      }
      break;
    }

    case CO_BROWSING_REDUCER.URL: {
      if (action.payload.currentURL) {
        return { ...state, currentURL: action.payload.currentURL };
      }
      break;
    }

    case CO_BROWSING_REDUCER.SHOW_TOOLS: {
      if (typeof action.payload.showTools === 'boolean') {
        return { ...state, showTools: action.payload.showTools };
      }
      break;
    }

    case CO_BROWSING_REDUCER.TOOL_CHANGE: {
      if (typeof action.payload.selectedTool === 'number') {
        return { ...state, selectedTool: action.payload.selectedTool };
      }
      break;
    }

    case CO_BROWSING_REDUCER.SHOW_SETTINGS: {
      if (typeof action.payload.showSettings === 'boolean') {
        return { ...state, showSettings: action.payload.showSettings };
      }
      break;
    }

    case CO_BROWSING_REDUCER.SAME_USER_SCREEN_SIZE: {
      if (typeof action.payload.sameUserScreenSize === 'boolean') {
        return { ...state, sameUserScreenSize: action.payload.sameUserScreenSize };
      }
      break;
    }

    case CO_BROWSING_REDUCER.SESSION_START: {
      if (typeof action.payload.startedSession === 'boolean') {
        return { ...state, startedSession: action.payload.startedSession };
      }
      break;
    }

    case CO_BROWSING_REDUCER.SESSION_KEY: {
      if (typeof action.payload.sessionKey === 'string') {
        return { ...state, sessionKey: action.payload.sessionKey };
      }
      break;
    }

    case CO_BROWSING_REDUCER.SHOW_HISTORY: {
      if (typeof action.payload.showHistory === 'boolean') {
        return { ...state, showHistory: action.payload.showHistory };
      }
      break;
    }
  }
  return state;
};
