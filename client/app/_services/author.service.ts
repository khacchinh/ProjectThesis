import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';

@Injectable()
export class AuthorService {
    constructor(private http: Http, private config: AppConfig) { 
    }

    getAll() {
       return this.http.get(this.config.apiUrl + '/api/author')
            .map(res => res.json());
    }

    getById(id: number) {
       // return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
       /// return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    deActiveAuthor(id: string){
        return this.http.put(this.config.apiUrl + '/api/authordeactive/' + id, JSON.stringify({}))
            .map(res => res.json());
    }

    onActiveAuthor(id: string){
        return this.http.put(this.config.apiUrl + '/api/authoronactive/' + id, JSON.stringify({}))
            .map(res => res.json());
    }

}