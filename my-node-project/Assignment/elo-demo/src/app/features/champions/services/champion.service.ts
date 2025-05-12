import { Injectable } from '@angular/core';
import { Champion, ChampionClass } from '../model/champion.model';
import { LEAGUE_OF_LEGENDS_CHAMPIONS } from '../data/champion.data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChampionService {
  private apiUrl = 'http://localhost:5000/api/champions';
  private champions: Champion[] = LEAGUE_OF_LEGENDS_CHAMPIONS;

  constructor(private http: HttpClient) {
    this.champions.sort((a, b) => a.name.localeCompare(b.name));
  }

   private handleError(error: HttpErrorResponse) {
    console.error('Champion API Error:', error);
    let errorMessage = 'An unknown error occurred with Champion API!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side/Network error: ${error.error.message}`;
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error) || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  

  getChampions(): Observable<Champion[]> { 
    return of(LEAGUE_OF_LEGENDS_CHAMPIONS); 
  }

   getChampionById(championId: string): Observable<Champion> {
    return this.http.get<Champion>(`${this.apiUrl}/${championId}`)
      .pipe(
        tap(champion => console.log(`Fetched champion by ID ${championId}:`, champion)),
        catchError(this.handleError)
      );
  }

  getRandomChampion(): Champion {
    if (this.champions.length === 0) {
      throw new Error("No champions available to select randomly.");
    }
    const randomIndex = Math.floor(Math.random() * this.champions.length);
    return this.champions[randomIndex];
  }

  getChampionsByClass(championClass: ChampionClass): Champion[] {
    return this.champions.filter(c => c.championClass === championClass);
  }
}