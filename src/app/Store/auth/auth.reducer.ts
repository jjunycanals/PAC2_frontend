import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../auth.actions';

// Define la interfaz para el estado de autenticación
export interface AuthState {
  [x: string]: any;
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
}

// Estat inicial
export const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  accessToken: null
};

// Crea el reductor per les accions de la autenticació
export const authReducer = createReducer(
  initialState,
  on(login, (state, { userId, accessToken }) => ({
    ...state,
    isAuthenticated: true,
    userId,
    accessToken
  })),
  on(logout, (state) => ({
    ...state,
    isAuthenticated: false,
    userId: null,
    accessToken: null
  }))
);
