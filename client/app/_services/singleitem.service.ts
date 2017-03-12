import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SingleItemService{
    constructor(private http:Http){
        console.log('News Services Initialized....');
    }

    getSingleNewById(id:string){
        let options = new RequestOptions({
            search: new URLSearchParams('id='+id)
        });
        return this.http.get('/api/new_item', options).map(res => res.json());
    }
}