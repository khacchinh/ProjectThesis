import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { User } from '../_models/user';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(username: string, password: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/authen', JSON.stringify({ username: username, password: password }), {headers: headers})
            .map((response: Response) => {
                let user = response.json();
                if (user.username == username && user.password == password) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}