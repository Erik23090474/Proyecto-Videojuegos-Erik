import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-videojuegos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-videojuegos.html',
  styleUrl: './lista-videojuegos.css'
})
export class ListaVideojuegosComponent implements OnInit {
  listVideojuegos: any[] = [];
  loading: boolean = true;

  constructor(private _videojuegosService: VideojuegosService) {}

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  cargarVideojuegos() {
  const userString = localStorage.getItem('user');

  if (!userString) {
    console.error("No hay usuario en localStorage");
    this.loading = false;
    return;
  }

  const user = JSON.parse(userString);
  const uid = user.uid;

  console.log("UID:", uid); // debug

  this._videojuegosService.obtenerVideojuegos(uid).subscribe({
    next: (data: any[]) => {
      this.listVideojuegos = data;
      this.loading = false;
    },
    error: (err: any) => {
      console.error('Error al cargar la lista:', err);
      this.loading = false;
    }
  });
}
}