import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>Bienvenido a la Colección de Videojuegos</h1>
      <p>Inicia sesión para gestionar tus juegos</p>
      <button (click)="authService.loginConGoogle()" 
              style="padding: 10px 20px; cursor: pointer; background-color: #4285F4; color: white; border: none; border-radius: 5px;">
        Entrar con Google
      </button>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService); // Traemos a nuestro "especialista"
}