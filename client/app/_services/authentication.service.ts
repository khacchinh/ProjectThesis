import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { User } from '../_models/user';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(username: string, password: string, access: number = 0) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/authen', JSON.stringify({ username: username, password: password, access: access }), {headers: headers})
            .map((response: Response) => {
                let user = response.json();
                if (user.username == username && user.password == password) {
                    if (user.username == "admin" && access == 1)
                        localStorage.setItem('currentAdmin', JSON.stringify(user));
                    else localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {   
        localStorage.removeItem('currentUser');
    }

    logoutAdmin() {   
        localStorage.removeItem('currentAdmin');
    }
}