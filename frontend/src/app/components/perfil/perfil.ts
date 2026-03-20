import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore'; // Cambiamos docData por onSnapshot
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  private firestore = inject(Firestore);
  private fb = inject(FormBuilder);

  videojuegoForm!: FormGroup;
  
  // Usamos un BehaviorSubject para manejar los datos de Firestore manualmente y evitar el error de tipo
  private userDataSource = new BehaviorSubject<any>(null);
  userData$ = this.userDataSource.asObservable();

  ngOnInit(): void {
    // 1. Inicializar el formulario
    this.videojuegoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      anio: ['', [Validators.required, Validators.min(1950)]],
      genero: ['', [Validators.required]]
    });

    // 2. Escuchar al usuario de Auth y luego traer sus datos de Firestore
    this.authService.user$.subscribe(user => {
      if (user) {
        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
        
        // onSnapshot escucha cambios en tiempo real sin errores de "_Query"
        onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            this.userDataSource.next(snapshot.data());
          }
        });
      }
    });
  }

  guardarVideojuego() {
    if (this.videojuegoForm.valid) {
      console.log('Datos listos para SQL:', this.videojuegoForm.value);
      alert('¡Datos capturados! El formulario funciona correctamente.');
      this.videojuegoForm.reset();
    }
  }
}