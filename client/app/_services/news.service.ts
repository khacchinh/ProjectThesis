import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class NewsService{
    constructor(private http:Http){
        console.log('News Services Initialized....');
    }

    getNewsByCategory(category_name:string, page_num: number, limit_num: number){
        let options = new RequestOptions({
            search: new URLSearchParams('category='+category_name+'&page='+page_num+'&limit='+limit_num)
        });
        return this.http.get('/api/news', options).map(res => res.json());
    }
}