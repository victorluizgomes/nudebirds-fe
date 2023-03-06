import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

// Set the http options
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})
export class MoonbirdsService {

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(() => new Error(error.error.message));
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public getMoonbirdsMetadata(url: string): Observable<any> {

    // Call the http GET
    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }


}
