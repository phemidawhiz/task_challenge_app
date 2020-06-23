import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root'})

export class AuthService {

    constructor(private http: HttpClient) {}

    signUp(email: string, password: string) {
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        });
    }

    login(email: string, password: string) {
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        });
    }
}