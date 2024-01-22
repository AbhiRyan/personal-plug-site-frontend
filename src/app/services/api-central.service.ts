import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiCentralService {
  http = inject(HttpClient);

  public getTestString(): Observable<{ testString: string }> {
    return this.http.get<{ testString: string }>(
      API_URL + `/api/central/test-string`
    );
  }
}
