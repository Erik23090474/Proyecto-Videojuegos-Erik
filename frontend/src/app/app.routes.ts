import { Routes } from '@angular/router';
// Importamos los componentes (Asegúrate de que las rutas de los archivos sean correctas)
import { LoginComponent } from './components/login/login';
import { PerfilComponent } from './components/perfil/perfil';
import { ListaVideojuegosComponent } from './components/lista-videojuegos/lista-videojuegos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'lista', component: ListaVideojuegosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' } // Ruta por si escriben algo mal
];