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

    getNewsBySearch(searchparams:string){
        let options = new RequestOptions({
            search: new URLSearchParams('search_title='+searchparams)
        });
        return this.http.get('/api/news_search', options).map(res => res.json());
    }

    getNewsBySearchParams(params : any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/news_search_params', JSON.stringify(params), {headers : headers}).map(res => res.json());
    }

    getNewsHot(){
        return this.http.get('/api/news_hot').map(res => res.json());
    }

    getNewsPopular(){
        return this.http.get('/api/news_popular').map(res => res.json());
    }

    getNewsComment(){
        return this.http.get('/api/news_comment').map(res => res.json());
    }

    deNewsbyId(id : string){
        return this.http.delete('/api/news_delete/' + id)
            .map(res => res.json());
    }
}