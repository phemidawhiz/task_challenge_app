import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const FIRE_BASE_API_KEY = 'AIzaSyCmCgWkoZVe0H_FDdzzfIEp4yOEw3LGkfA';

@Injectable({ providedIn: 'root'})

export class AuthService {

    constructor(private http: HttpClient) {}

    signUp(email: string, password: string) {
        this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        }).subscribe(resData => {
            console.log("Response: ", resData);
        });
    }

    login(email: string, password: string) {
        
    }
}