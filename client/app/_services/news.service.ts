import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';

@Injectable()
export class NewsService{
    constructor(private http:Http, private config: AppConfig){
    }

    getNewsByCategory(category_name:string){
        let options = new RequestOptions({
            search: new URLSearchParams('category='+category_name)
        });
        return this.http.get(this.config.apiUrl + '/api/news', options).map(res => res.json());
    }

    getNewsBySearch(searchparams:string){
        let options = new RequestOptions({
            search: new URLSearchParams('search_title='+searchparams)
        });
        return this.http.get(this.config.apiUrl + '/api/news_search', options).map(res => res.json());
    }

    getNewsBySearchParams(params : any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.config.apiUrl + '/api/news_search_params', JSON.stringify(params), {headers : headers}).map(res => res.json());
    }

    getNewsHot(){
        return this.http.get(this.config.apiUrl + '/api/news_hot').map(res => res.json());
    }

    getNewsPopular(){
        return this.http.get(this.config.apiUrl + '/api/news_popular').map(res => res.json());
    }

    getNewsComment(){
        return this.http.get(this.config.apiUrl + '/api/news_comment').map(res => res.json());
    }

    deNewsbyId(id : string){
        return this.http.delete(this.config.apiUrl + '/api/news_delete/' + id)
            .map(res => res.json());
    }

    addDataUserNews(data : any){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.config.apiUrl + '/api/adddatausernews', JSON.stringify(data), {headers : headers})
            .map(res => res.json());
    }

    getDataNewsUserById(id : string){
        return this.http.get(this.config.apiUrl + '/api/datauserid/' + id).map(res => res.json());
    }
}