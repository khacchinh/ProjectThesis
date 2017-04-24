import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SingleItemService{
    constructor(private http:Http){
    }

    getSingleNewById(id:string){
        let options = new RequestOptions({
            search: new URLSearchParams('id='+id)
        });
        return this.http.get('/api/new_item', options).map(res => res.json());
    }

    saveCommentForNewItem(id: string, comment:any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/new_item/'+id, JSON.stringify(comment), {headers : headers})
            .map(res => res.json());
    }

    getNewsRelative(tags : any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/new_relative', JSON.stringify(tags), {headers : headers})
            .map(res => res.json());
    }
}