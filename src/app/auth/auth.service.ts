import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { alert } from 'tns-core-modules/ui/dialogs';
import { User } from './user.model';


const FIRE_BASE_API_KEY = 'your_api_key';

interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root'})

export class AuthService {

    private _user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) {}

    get user() {
        return this._user.asObservable();
    }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(errorResponse => {
            this.handleError(errorResponse.error.error.message);
            return throwError(errorResponse);
        }), tap(resData => {
            if(resData && resData.idToken) {
                if(resData && resData.idToken) {
                    this.handleLogin(email, resData.idToken, resData.localId, parseInt(resData.expiresIn));
                }
            }
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIRE_BASE_API_KEY}`, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(errorResponse => {
            this.handleError(errorResponse.error.error.message);
            return throwError(errorResponse);
        }), tap(resData => {
            if(resData && resData.idToken) {
                this.handleLogin(email, resData.idToken, resData.localId, parseInt(resData.expiresIn));
            }
        }))
    }

    private handleLogin(email: string, token: string, userId: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this._user.next(user);
    }

    private handleError(errorMessage: string) {
        switch(errorMessage) {
            case 'EMAIL_EXIST':
                alert("Email already exist");
                break;
            case 'INVALID_PASSWORD':
                alert("Password is invalid");
                break;
            case 'EMAIL_NOT_FOUND':
                alert("Email not found");
                break;
            default:
                alert("Unauthorised access, pleaase check your login credentials");
        }
    }
}