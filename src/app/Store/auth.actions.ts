import { createAction, props } from '@ngrx/store';

// Defineix l'acció de login amb userId i l'accessToken
export const login = createAction(
  '[Auth] Login',
  props<{ userId: string; accessToken: string }>()
);

// Defineix l'acció de logout
export const logout = createAction('[Auth] Logout');
