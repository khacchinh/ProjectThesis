import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthorService {
    constructor(private http: Http) { 
    }

    getAll() {
       return this.http.get('/api/author')
            .map(res => res.json());
    }

    getById(id: number) {
       // return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
       /// return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    deActiveAuthor(id: string){
        return this.http.put('/api/authordeactive/' + id, JSON.stringify({}))
            .map(res => res.json());
    }

    onActiveAuthor(id: string){
        return this.http.put('/api/authoronactive/' + id, JSON.stringify({}))
            .map(res => res.json());
    }

}