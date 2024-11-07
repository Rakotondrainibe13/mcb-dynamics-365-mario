import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { client_secret, tenant_id, client_id, url } from './config';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private tokenUrl = 'https://login.microsoftonline.com/' + tenant_id + '/oauth2/v2.0/token';

  constructor(private http: HttpClient) { }

  private apiUrl = url + '/api/data/v9.2/invitation';

  getToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'fpc=AmlRP-iZOcBJp_Q0DmdguoVq81k8AQAAAMy1vt4OAAAAZ70dJwIAAADiuL7eDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
    });
    const body = new HttpParams()
      .set('client_id', client_id)
      .set('scope', 'https://org7c730ca8.crm4.dynamics.com/.default')
      .set('client_secret', client_secret)
      .set('grant_type', 'client_credentials');
      return this.http.post<any>(this.tokenUrl, body, { headers }).pipe(
        map(response => response.access_token),
        catchError(error => {
          console.error('Error fetching token:', error);
          return of('');
        })
      );
  }
  getInvitations(): Observable<any> {
    return this.getToken().pipe(
      map(token => {
        if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Accept': 'application/json'
          });

          return this.http.get<any>(this.apiUrl, { headers }).pipe(
            catchError(error => {
              console.error('Error fetching data from Dynamics API:', error);
              return of(null);
            })
          );
        } else {
          console.error('Token not available');
          return of(null);
        }
      })
    );
  }

  refusedInvitation(recordId: string): Observable<any> {
    // Récupère le token
    return this.getToken().pipe(
      map(token => {
        if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          });

          const url = `${this.apiUrl}(${recordId})`;
          return this.http.patch<any>(url, { status : false}, { headers }).pipe(
            catchError(error => {
              console.error('Error updating data in Dynamics API:', error);
              return of(null);
            })
          );
        } else {
          console.error('Token not available');
          return of(null);
        }
      })
    );
  }
}
