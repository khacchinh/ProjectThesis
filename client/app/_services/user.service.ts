import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from '../_models/index';
import { AppConfig } from '../app.config';

@Injectable()
export class UserService {
    constructor(private http: Http, private config: AppConfig) { 
    }

    getAll() {
       return this.http.get(this.config.apiUrl + '/api/accounts')
            .map(res => res.json());
    }

    getUserById(id: string) {
       return this.http.get(this.config.apiUrl + '/api/accounts/' + id)
            .map(res => res.json());
    }

    getDataNewsUserByIdDetail(id: string) {
       return this.http.get(this.config.apiUrl + '/api/accounts/datauser/' + id)
            .map(res => res.json());
    }

    removeDataUser(data : any) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.config.apiUrl + '/api/accounts/removedatauser', JSON.stringify(data), {headers : headers})
            .map(res => res.json());
    }

    addUsers(user: User) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.config.apiUrl + '/api/account', JSON.stringify(user), {headers : headers})
            .map(res => res.json());
    }

    checkExistUser(username : string){
        return this.http.get(this.config.apiUrl + '/api/accounts_exist/' + username)
            .map(res => res.json());
    }

    updateUsers(user: any) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(this.config.apiUrl + '/api/accounts/' + user._id, JSON.stringify(user), {headers : headers})
            .map(res => res.json());
    }

    deActiveUsers(id : string){
        return this.http.put(this.config.apiUrl + '/api/accountdeactive/' + id, JSON.stringify({}))
            .map(res => res.json());
    }

    delete(id: number) {
       /// return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods
    /*
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
    */
}