import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'https://smarty.kerzz.com:4004/api/mock/getFeed';
  private apiKey = 'bW9jay04ODc3NTU2NjExMjEyNGZmZmZmZmJ2';

  constructor(private http: HttpClient) { }

  getFeed(skip: number, limit: number, latitude: number, longitude: number): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'apiKey': this.apiKey,
      'Content-Type': 'application/json'
    });

    const body = {
      skip,
      limit,
      latitude,
      longitude
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
