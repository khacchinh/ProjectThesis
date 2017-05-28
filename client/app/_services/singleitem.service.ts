import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';

@Injectable()
export class SingleItemService{
    constructor(private http:Http, private config: AppConfig){
    }

    getSingleNewById(id:string){
        let options = new RequestOptions({
            search: new URLSearchParams('id='+id)
        });
        return this.http.get(this.config.apiUrl + '/api/new_item', options).map(res => res.json());
    }

    saveCommentForNewItem(id: string, comment:any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(this.config.apiUrl + '/api/new_item/'+id, JSON.stringify(comment), {headers : headers})
            .map(res => res.json());
    }

    getNewsRelative(tags : any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.config.apiUrl + '/api/new_relative', JSON.stringify(tags), {headers : headers})
            .map(res => res.json());
    }
}