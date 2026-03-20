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
    this.myAppUrl = environment.apiUrl;
  }

  // Método para guardar el videojuego en SQL Server
  guardarVideojuego(videojuego: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}/videojuegos`, videojuego);
  }
}