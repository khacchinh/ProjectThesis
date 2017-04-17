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
                let result = response.json();
                let user = result.user;
                
                if (user.username == username && user.password == password) {
                    if (user.access == 1 && access == 1)
                        localStorage.setItem('currentAdmin', JSON.stringify(result));
                    else localStorage.setItem('currentUser', JSON.stringify(result));
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