import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const FIRE_BASE_API_KEY = 'your_api_key';

@Injectable({ providedIn: 'root'})

export class AuthService {

    constructor(private http: HttpClient) {}

    signUp(email: string, password: string) {
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(errorResponse => {
            this.handleError(errorResponse.error.error.message);
            return throwError(errorResponse);
        }));
    }

    login(email: string, password: string) {
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        });
    }

    private handleError(errorMessage: string) {
        console.log(errorMessage);
    }
}