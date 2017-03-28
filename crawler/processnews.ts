import { News } from './News';
import { TSPromise } from "typescript-promise";
import * as fs from 'fs';
import * as path from 'path';
import * as Crawler from 'crawler';

export class ProcessNews{

    static tempArrNews : Array<News> = new   Array<News>();
    static arrNews : Array<News> = new   Array<News>();
    static arOldNews : Array<News> = new   Array<News>();

    constructor(){
    }

    importNew(news:News){
        
        if (news.title+'' == "undefined" || news.img+'' == "undefined" || news.url+'' == "undefined" || news.sumary+'' == "undefined" || news.category+'' == "undefined")
            return;
        if (this.checkExistNews(news.title))
            return;
        //console.log(this.checkExistNews(news.title));
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
            ProcessNews.tempArrNews.forEach( element => {
                    var c = new Crawler({
                        maxConnections: 1,
                        callback: (error, res, done) => {
                            if (error) reject(false);
                            count++;
                            var $ = res.$;
                            if (element.author == "vnexpress"){
                                $("table").remove();
                                $(".fck_detail").children().last().remove();
                                $(".fck_detail").children('.Normal[style*="text-align:right;"]').remove();
                                var content = $(".fck_detail").text() + '';
                                var date = $(".block_timer_share").children().first().text(); 
                                element.date_public = ProcessNews.getDate(date, element.author);
                                element.content = content.toString().trim();
                            } 
                            else if (element.author == "vccorp.vn"){
                                $("#divNewsContent").children('div').remove();
                                $("#divNewsContent").children().last().remove();
                                $("#divNewsContent").children('p[style*="text-align: right;"]').remove();
                                var content = $("#divNewsContent").text() + '';
                                element.content = content.toString().trim();
                                var date = $(".box26").children("span").text();
                                element.date_public = ProcessNews.getDate(date, element.author);
                            }
                            else if (element.author == "thanhnien"){
                                $("table").remove();
                                $("#abody").children('div').children('article').remove();
                                $("#abody").children().last().remove();
                                var content = $("#abody").text() + '';
                                element.content = content.toString().trim();
                                $("time").children("span").remove();
                                var date = $("time").text();
                                element.date_public = ProcessNews.getDate(date, element.author);
                            }
                            else if (element.author == "vietnamnet news"){
                                $("table").remove();
                                $("br").remove();
                                $("a").remove();
                                $("#ArticleContent").children('div').remove();
                                $("#ArticleContent").children().last().remove();
                                $("#ArticleContent").children().first().remove();
                                var content = $("#ArticleContent").text() + '';
                                element.content = content.toString().trim();
                                var date = $(".ArticleDateTime").children("span").text();
                                element.date_public = ProcessNews.getDate(date, element.author);
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
//.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”"…\n\r\t]/g," ")
    static exportFile(){
        console.log('Tiền xử lý: ')
        var dataTitle = '';
        console.log('- loại bỏ dấu câu')
        ProcessNews.tempArrNews.forEach( (element, index) => {
            if (element.content || element.content != "" || element.content.length != 0){
                ProcessNews.arrNews.push(element);
                dataTitle += element.content.replace(/[\n\t\r]/g, " ") + "\n";
            }
        });
        fs.writeFileSync(path.join(__dirname + '/tokenizer/data/input.txt'), dataTitle); 
    }

    clearPunctuation(txt: string) : string{
        return txt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”]/g, "");
    }

    static getDate(date : string, author: string) : Date{
        date = date.trim().replace(/\xA0/g,' ');
        if (date == "")
            return new Date();
        var arrTime = date.split(" ");
        var dateneed = '';
        switch(author){
            case "vnexpress":
            case "vccorp.vn":
                dateneed = arrTime[2].split("/").reverse().join("-") + " " + arrTime[4] + ":00"
            break;

            case "thanhnien":
                dateneed = arrTime[3].split("/").reverse().join("-") + " " + ProcessNews.convertTime12to24(arrTime[0] + " " + arrTime[1])
            break;

            case "vietnamnet news":
                dateneed = arrTime[0].split("/").reverse().join("-") + " " + arrTime[2]
            break;


        }
        //date.trim().split(" ")[2].split("/").reverse().join("-") + " " + date.trim().split(" ")[4] + ":00"
        //dan tri  : Thứ Bảy, 25/03/2017 - 21:12
        //vnexpress: Thứ bảy, 25/3/2017 | 23:10 GMT+7
        //thanhnien: 06:27 AM - 25/03/2017 
        //vietnamnet: 25/03/2017  15:40 GMT+7
        return new Date(dateneed);
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

}