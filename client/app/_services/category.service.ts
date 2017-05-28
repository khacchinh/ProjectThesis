import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';

@Injectable()
export class CategoryService {
    constructor(private http: Http, private config: AppConfig) { 
    }

    getAll() {
       return this.http.get(this.config.apiUrl + '/api/categorys')
            .map(res => res.json());
    }

    getById(id: number) {
       // return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
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