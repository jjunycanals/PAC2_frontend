import { createAction, props } from '@ngrx/store';
import { AuthDTO } from 'src/app/Models/auth.dto';

// Definir las acciones relacionadas con la autenticación
export const login = createAction(
  '[Auth] Login', // Nombre de la acción
  props<{ authDTO: AuthDTO }>() // Definición de los parámetros de entrada
);

export const logout = createAction('[Auth] Logout');
