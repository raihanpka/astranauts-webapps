// State management templates for consistent state handling
export interface BaseState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface PaginatedState<T> extends BaseState<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface FormState<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// State action types
export type StateAction<T> =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: T }
  | { type: "ERROR"; payload: string }
  | { type: "RESET" }

// Generic state reducer
export function createStateReducer<T>() {
  return (state: BaseState<T>, action: StateAction<T>): BaseState<T> => {
    switch (action.type) {
      case "LOADING":
        return {
          ...state,
          loading: true,
          error: null,
        }
      case "SUCCESS":
        return {
          ...state,
          loading: false,
          data: action.payload,
          error: null,
          lastUpdated: new Date(),
        }
      case "ERROR":
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case "RESET":
        return {
          data: null,
          loading: false,
          error: null,
          lastUpdated: null,
        }
      default:
        return state
    }
  }
}

// Initial state factory
export function createInitialState<T>(): BaseState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  }
}
