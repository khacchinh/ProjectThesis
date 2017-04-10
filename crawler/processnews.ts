import { News } from './News';
import { TSPromise } from "typescript-promise";
import * as fs from 'fs';
import * as path from 'path';
import * as Crawler from 'crawler';

import * as Collections from 'typescript-collections';

export class ProcessNews{

    static tempArrNews : Array<News> = new   Array<News>();
    static arrNews : Array<News> = new   Array<News>();
    static arOldNews : Array<News> = new   Array<News>();
    private count = 0;

    static arFlagTime : Collections.Dictionary<string, Date> = new Collections.Dictionary<string, Date>();
    static arFlagTitle : Collections.Dictionary<string, string> = new Collections.Dictionary<string, string>();
    static saveFlagTime : Collections.Dictionary<string, Date> = new Collections.Dictionary<string, Date>();

    constructor(){
    }

    importNew(news:News){
        if (news.title+'' == "undefined" || news.img+'' == "undefined" || news.url+'' == "undefined" || news.sumary+'' == "undefined" || news.category+'' == "undefined")
            return;
        if (this.checkExistNews(news.title))
            return;
        news.category = news.category.trim().toLowerCase();
        news.author = news.author.trim().toLowerCase();
        ProcessNews.tempArrNews.push(news)
    }

    checkExistNews(title: string) : Boolean {
        var is_title = false;
        ProcessNews.arOldNews.forEach(element => {
            if (element.title.toString().trim().toLowerCase() == title.toString().trim().toLowerCase()){
                is_title = true;
                return true;
            }
        });
        return is_title;
    }

    static getContent() : Promise<boolean> {
        var count = 0;
        let p = new Promise<boolean> (function(resolve, reject){
            ProcessNews.tempArrNews.forEach(element => {
                    var c = new Crawler({
                        maxConnections: 1,
                        callback: (error, res, done) => {
                            if (error) reject(false);
                            count++;
                            var $ = res.$;
                            if (element.author == "vnexpress"){
                                $("a").remove();
                                $("em").remove();
                                $(".fck_detail").children("div").remove();
                                $(".fck_detail").children().last().remove();
                                $(".fck_detail").children('.Normal[style*="text-align:right;"]').remove();
                                let content = $(".fck_detail").text();
                                let date = $(".block_timer_share").children().first().text(); 
                                element.date_public = ProcessNews.getDate(date, element.author, element.category);
                                element.content = content.toString().trim();

                                ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                            } 
                            else if (element.author == "dantri"){
                                $("#divNewsContent").children('div').remove();
                                $("#divNewsContent").children().last().remove();
                                $("#divNewsContent").children('p[style*="text-align: right;"]').remove();
                                let content = $("#divNewsContent").text();
                                element.content = content.toString().trim();
                                let date = $(".box26").children("span").text();
                                element.date_public = ProcessNews.getDate(date, element.author, element.category);

                                ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                            }
                            else if (element.author == "thanhnien"){
                                $("table").remove();
                                $("#abody").children('div').children('article').remove();
                                $("#abody").children().last().remove();
                                $("#abody").children('p[style*="text-align: right;"]').remove();
                                let content = $("#abody").text();
                                element.content = content.toString().trim();
                                $("time").children("span").remove();
                                let date = $("time").text();
                                element.date_public = ProcessNews.getDate(date, element.author, element.category);

                                ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                            }
                            else if (element.author == "vietnamnet news"){
                                let content = "";
                                $("div.inner-article").remove();
                                $("#ArticleContent div").remove();
                                $("#ArticleContent p iframe").remove();
                                $("table").remove();
                                $("#ArticleContent").children().first().remove();
                                $("#ArticleContent").children().last().remove();
                                content = $("#ArticleContent").text();
                                element.content = content.toString().trim();
                                let date = $(".ArticleDateTime").children("span").text();
                                element.date_public = ProcessNews.getDate(date, element.author, element.category);

                                ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                            }
                            else if (element.author == "zing"){
                                $(".the-article-body table").remove();
                                $(".the-article-body").children("div").remove();
                                $(".the-article-body").children("figure").remove();
                                $(".the-article-body").children("script").remove();
                                let content = $(".the-article-body").text();
                                let date = $('.the-article-publish').text();
                                element.content = content;
                                element.date_public = ProcessNews.getDate(date, element.author, element.category);
                                ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                            }
                            else if (element.author == "tintuc"){
                                let content = "";
                                let date;
                                $("figure").remove();
                                $("table").remove();
                                $("#articleContent div").remove();
                                $("#articleContent p[style*='text-align: center;']").remove();
                                content = $("#articleContent").text();
                                date = $(".publish-date").children().text();
                                element.content = content;
                                element.date_public = ProcessNews.getDate(date, element.author, element.category);
                                ProcessNews.saveFlagNewsItem(element.author, element.category, element.title, element.date_public);
                            }
                            
                            if (count == ProcessNews.tempArrNews.length)
                                resolve(true);
                        }
                    });
                    c.queue(element.url);
            });
        });
        return p;
    }

    static exportFile(){
        console.log('Tiền xử lý: ')
        console.log('- loại bỏ dấu câu')
        console.log(ProcessNews.tempArrNews.length);
        var dataTitle = '';
        ProcessNews.tempArrNews.forEach( (element, index) => {
            element.content = element.content +'';
            if (element.content.trim().length != 0 && element.date_public != null){
                ProcessNews.arrNews.push(element);
                dataTitle += element.content.replace(/[\n\t\r]/g, " ") + "\n";
            }
        });
        ProcessNews.tempArrNews.length = 0; //clear all element array
        fs.writeFileSync(path.join(__dirname + '/tokenizer/data/input.txt'), dataTitle); 
    }

    clearPunctuation(txt: string) : string{
        return txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”]/g, "");
    }

    static getDate(date : string, author: string, category: string) : Date{
        var key = author + "-" + category;
        date = date.trim().replace(/\xA0/g,' ');
        var arrTime = date.split(" ");
        var dateneed;
        if (date == "")
            dateneed =  null;
        else {
            switch(author){
                case "vnexpress":
                case "dantri":
                    dateneed = arrTime[2].split("/").reverse().join("-") + " " + arrTime[4] + ":00"
                break;

                case "thanhnien":
                    dateneed = arrTime[3].split("/").reverse().join("-") + " " + ProcessNews.convertTime12to24(arrTime[0] + " " + arrTime[1])
                break;

                case "vietnamnet news":
                    dateneed = arrTime[0].split("/").reverse().join("-") + " " + arrTime[2]
                break;

                case "zing":
                    dateneed = arrTime[1].split("/").reverse().join("-") + " " + arrTime[0];
                break;
                
                case "tintuc":
                    if (arrTime.length <= 2)
                        dateneed = null;
                    else dateneed = arrTime[2].split("/").join("-") + "  " + arrTime[0] + ":00"
                break;
            }
        }
        if (dateneed == null)
            return dateneed;
        dateneed = new Date(dateneed);
        if (ProcessNews.saveFlagTime.getValue(key)){
            if (ProcessNews.saveFlagTime.getValue(key).getTime() > dateneed.getTime())
                return null;
        }
        return dateneed;
    }

    static convertTime12to24(time12h) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return hours + ':' + minutes;
    }

    static saveFlagNewsItem(author: string, category: string, title:string, date:Date){
        var key = author + "-" + category;
        if (date != null){
            if (ProcessNews.arFlagTime.getValue(key)){
                var flagDate = ProcessNews.arFlagTime.getValue(key).getTime() < date.getTime() ?  date : ProcessNews.arFlagTime.getValue(key) ;
                if (flagDate == date){
                    ProcessNews.arFlagTitle.setValue(key, title);
                    ProcessNews.arFlagTime.setValue(key, date); 
                }
            } else {
                ProcessNews.arFlagTime.setValue(key, date); 
                ProcessNews.arFlagTitle.setValue(key, title);
            }
        }
    }

}