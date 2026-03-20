import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Retornamos una Promesa porque Firebase tarda un milisegundo en responder
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ¡Hay usuario! Adelante, pase usted.
        resolve(true);
      } else {
        // No hay nadie. ¡Pa' fuera! (al login)
        alert('Acceso denegado. Por favor, inicia sesión primero.');
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};