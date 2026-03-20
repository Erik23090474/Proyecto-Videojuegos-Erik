import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VideojuegosService } from '../../services/videojuegos';
import { Auth, user, User, signOut } from '@angular/fire/auth'; // Importamos 'user' observable
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  // Asegúrate de tener estas importaciones para que funcionen los formularios y *ngIf
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  
  // Observable para escuchar los cambios del usuario de Firebase
  user$: Observable<User | null>; 

  constructor(
    private fb: FormBuilder,
    private _videojuegosService: VideojuegosService,
    private auth: Auth,
    private router: Router
  ) {
    // Definimos el formulario con validaciones
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      anio: ['', [Validators.required, Validators.min(1950), Validators.max(2026)]],
      genero: ['', [Validators.required]] // Recibe el ID (1, 2 o 3)
    });

    // Inicializamos el observable del usuario
    this.user$ = user(this.auth);
  }

  ngOnInit(): void {
    // Podrías usar this.user$.subscribe(...) si necesitas hacer algo específico al cargar
  }
  
  async logOut() {
    try {
      await signOut(this.auth); // Cierra la sesión en Firebase
      alert('Sesión cerrada correctamente');
      this.router.navigate(['/login']); // Redirige al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }


  async guardarVideojuego() {
    if (this.form.invalid) {
      alert('Por favor, llena todos los campos correctamente.');
      return;
    }

    this.loading = true;
    
    // Obtenemos el usuario actual de forma síncrona
    const currentUser = this.auth.currentUser; 

    if (!currentUser) {
      alert('Debes estar autenticado para guardar datos.');
      this.loading = false;
      return;
    }

    // Estructura de datos para el Backend (Somee/Railway)
    const datosVideojuego = {
      titulo: this.form.value.titulo,
      anio: this.form.value.anio,
      genero: parseInt(this.form.value.genero), // Convertimos a número
      usuario_uid: currentUser.uid // El ID único de Firebase
    };

    // Llamada al servicio
    this._videojuegosService.guardarVideojuego(datosVideojuego).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('¡Videojuego guardado en SQL Server (Somee) con éxito!');
        this.form.reset({genero: ''}); // Limpiamos dejando el select vacío
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al conectar con el servidor.');
        this.loading = false;
      }
    });
  }
}