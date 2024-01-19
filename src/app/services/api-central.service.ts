import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCentralService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:8080/';

  public getTestString() {
    return this.http.get(this.apiUrl + `/api/central/test-string`);
  }
}
