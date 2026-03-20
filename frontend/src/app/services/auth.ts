import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  user 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc 
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos las herramientas de Firebase y Angular
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // user$ observa el estado de la sesión
  user$ = user(this.auth);

  constructor() { }

  /**
   * Abre el popup de Google y guarda/actualiza al usuario en Firestore (NoSQL)
   */
  async loginConGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const resultado = await signInWithPopup(this.auth, provider);
      const usuarioFirebase = resultado.user;

      // --- GUARDADO EN FIRESTORE (Base de datos NoSQL) ---
      // Creamos una referencia al documento con el ID único del usuario (uid)
      const userDocRef = doc(this.firestore, `usuarios/${usuarioFirebase.uid}`);
      
      // Guardamos los datos. 'merge: true' hace que si el usuario ya existe, solo actualice los campos
      await setDoc(userDocRef, {
        uid: usuarioFirebase.uid,
        nombre: usuarioFirebase.displayName,
        email: usuarioFirebase.email,
        foto: usuarioFirebase.photoURL,
        ultimaConexion: new Date(),
        rol: 'usuario_estandar' // Ejemplo de dato extra que solo vive en tu BD
      }, { merge: true });

      console.log('Sesión iniciada y datos sincronizados con Firestore');
      
      // Navegamos a la UI 1 (Perfil e Inserción)
      this.router.navigate(['/perfil']);

    } catch (error) {
      console.error('Error en el proceso de Login:', error);
    }
  }

  /**
   * Cierra la sesión y limpia el rastro del usuario
   */
  async logout() {
    try {
      await signOut(this.auth);
      console.log('Sesión cerrada');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /**
   * Función opcional por si necesitas obtener los datos específicos 
   * que guardaste en Firestore más adelante.
   */
  async obtenerDatosUsuarioDesdeFirestore(uid: string) {
    const userDocRef = doc(this.firestore, `usuarios/${uid}`);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
}