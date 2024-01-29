import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { MessageDto } from '../types/messageDto';

@Injectable({
  providedIn: 'root',
})
export class ApiCentralService {
  http = inject(HttpClient);

  public getTestString(): Observable<MessageDto> {
    return this.http.get<MessageDto>(API_URL + `/central/test-string`, {
      withCredentials: true,
    });
  }
}
