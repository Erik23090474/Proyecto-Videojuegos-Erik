import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VideojuegosService } from '../../services/videojuegos';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _videojuegosService: VideojuegosService,
    private auth: Auth
  ) {
    // Definimos el formulario con validaciones básicas
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      anio: ['', [Validators.required, Validators.min(1950), Validators.max(2026)]],
      genero: ['', [Validators.required]] // Recibe el ID (1, 2 o 3)
    });
  }

  ngOnInit(): void {}

  guardarVideojuego() {
    if (this.form.invalid) {
      alert('Por favor, llena todos los campos correctamente.');
      return;
    }

    this.loading = true;
    const user = this.auth.currentUser; // Obtenemos el usuario autenticado en Firebase

    if (!user) {
      alert('Debes estar autenticado para guardar datos.');
      this.loading = false;
      return;
    }

    // Estructura de datos para el Backend
    const datosVideojuego = {
      titulo: this.form.value.titulo,
      anio: this.form.value.anio,
      genero: parseInt(this.form.value.genero), // Convertimos a número para SQL Server
      usuario_uid: user.uid // El ID único de Firebase
    };

    // Llamada al servicio
    this._videojuegosService.guardarVideojuego(datosVideojuego).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('¡Videojuego guardado en SQL Server (Somee) con éxito!');
        this.form.reset(); // Limpiamos el formulario
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