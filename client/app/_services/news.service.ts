import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class NewsService{
    constructor(private http:Http){
        console.log('News Services Initialized....');
    }

    getNewsByCategory(category_name:string){
        let options = new RequestOptions({
            search: new URLSearchParams('category='+category_name)
        });
        return this.http.get('/api/news', options).map(res => res.json());
    }
}