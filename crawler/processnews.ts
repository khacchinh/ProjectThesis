import { News } from './News';
import { TSPromise } from "typescript-promise";
import * as fs from 'fs';
import * as path from 'path';
import * as Crawler from 'crawler';

export class ProcessNews{

    static tempArrNews : Array<News> = new   Array<News>();
    static arrNews : Array<News> = new   Array<News>();

    constructor(){
    }

    importNew(news:News){
        
        if (news.title+'' == "undefined" || news.img+'' == "undefined" || news.url+'' == "undefined" || news.sumary+'' == "undefined" || news.category+'' == "undefined")
            return;

        news.category = news.category.trim().toLowerCase();
        news.author = news.author.trim().toLowerCase();
        ProcessNews.tempArrNews.push(news)
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
                                element.content = content.toString().trim();
                            }
                            else if (element.author == "vccorp.vn"){
                                $("#divNewsContent").children('div').remove();
                                $("#divNewsContent").children().last().remove();
                                $("#divNewsContent").children('p[style*="text-align: right;"]').remove();
                                var content = $("#divNewsContent").text() + '';
                                element.content = content.toString().trim();
                            }
                            else if (element.author == "thanhnien"){
                                $("table").remove();
                                $("#abody").children('div').children('article').remove();
                                $("#abody").children().last().remove();
                                var content = $("#abody").text() + '';
                                element.content = content.toString().trim();
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

}