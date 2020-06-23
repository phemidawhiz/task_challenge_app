import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, of } from 'rxjs';
import { alert } from 'tns-core-modules/ui/dialogs';
import { User } from './user.model';
import { RouterExtensions } from 'nativescript-angular/router';
import { setString, getString, hasKey, remove } from 'tns-core-modules/application-settings';


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
    private tokenExpirationTimer: number;

    constructor(private http: HttpClient, private router: RouterExtensions) {}

    get user() {
        return this._user.asObservable();
    }

    logout() {
        this._user.next(null);
        remove('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.router.navigate(['/'], {clearHistory: true});
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

    autoLogin() {
        if(!hasKey('userData')) {
            return of(false);
        }

        const userData: { 
            email: string, 
            id: string, 
            _token: string, 
            _tokenExpirationDate: string
        } = JSON.parse(getString('userData'));

        const loadedUser = new User(
            userData.email, userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        )

        if(loadedUser.isAuth) {
            this._user.next(loadedUser);
            this.autoLogout(loadedUser.timeToExpiry);
            this.router.navigate(['/challenges', {clearHistory: true}]);
            return of(true);
        }
        return of(true);
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
    }

    private handleLogin(email: string, token: string, userId: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn);
        const user = new User(email, userId, token, expirationDate);
        setString('userData', JSON.stringify(user));
        this.autoLogout(user.timeToExpiry);
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