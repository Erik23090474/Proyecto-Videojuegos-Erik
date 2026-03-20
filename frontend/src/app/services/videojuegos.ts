import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {
  private myAppUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.apiUrl; // Asegúrate de tener esto en environment.ts
  }

  // Enviar a SQL Server
  guardarVideojuego(videojuego: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}/videojuegos`, videojuego);
  }

  // Traer de SQL Server
  obtenerVideojuegos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}/videojuegos`);
  }
}