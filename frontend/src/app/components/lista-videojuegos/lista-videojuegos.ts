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
    this._videojuegosService.obtenerVideojuegos().subscribe({
      next: (data) => {
        this.listVideojuegos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la lista:', err);
        this.loading = false;
      }
    });
  }
}