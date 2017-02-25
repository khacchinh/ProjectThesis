import { News } from './News';
import { TSPromise } from "typescript-promise";
//import word segment
import { BMMWordSegment } from '../segment/BMMWordSegment';

import * as fs from 'fs';
import * as path from 'path';

export class ProcessReduplicateNew{

    private bmmWordSegment = new BMMWordSegment();

    private thoigioinews = new Array<News>();
    private kinhdoanhnews = new Array<News>();
    private thethaonews = new Array<News>();
    private congnghenews = new Array<News>();
    private suckhoenews = new Array<News>();
    private phatluatnews = new Array<News>();
    static thoisunews = new Array<News>();

    private count = 0;

    constructor(){

    }

    importNew(news:News){
        if (news.title == "" || news.img == "" || news.url == "http://thanhnien.vnundefined")
            return;
        
        if (news.category.toLowerCase() == 'thế giới'){
            this.importNewByCategory(news, this.thoigioinews);
        }
        else if (news.category.toLowerCase() == 'kinh doanh' || news.category.toLowerCase() == 'tài chính'){
            this.importNewByCategory(news, this.kinhdoanhnews);
        }
        else if (news.category.toLowerCase() == 'thể thao' || news.category.toLowerCase() == 'bóng đá'){
            this.importNewByCategory(news, this.thethaonews);
        }
        else if (news.category.toLowerCase() == 'số hóa' || news.category.toLowerCase() == 'công nghệ' || news.category.toLowerCase() == 'dân trí'){
            this.importNewByCategory(news, this.congnghenews);
        }
        else if (news.category.toLowerCase() == 'sức khỏe'){
            this.importNewByCategory(news, this.suckhoenews);
        }
        else if (news.category.toLowerCase() == 'pháp luật' || news.category.toLowerCase() == 'hình sự'){
            this.importNewByCategory(news, this.phatluatnews);
        }
        else if (news.category.toLowerCase() == 'thời sự' || news.category.toLowerCase() == 'tin nhanh'){
            this.importNewByCategory(news, ProcessReduplicateNew.thoisunews);
        }
    }

    importNewByCategory(news:News, arrNew : Array<News>){
        var count_same_author = 0;
        var similar = 0;
        if (arrNew.length == 0){
            arrNew.push(news);
            return;
        }
        else{
            arrNew.forEach(old_news => {
                if (news.author == old_news.author)
                    count_same_author++;
                    //cacular similar here
                else{
                    //
                    //!! code similar cosinse here and save mongodb
                    similar = this.processCacularSimilar(news.sumary, old_news.sumary);
                    //
                    if (similar > 0.7)   //delete new of new is reduplicate
                        return; 
                    count_same_author++;
                }
            });
            if (count_same_author == arrNew.length){
                arrNew.push(news);
            }
        }
    }

    exportFile(){
        var dataTitle = '';
        for (var i = 0; i < ProcessReduplicateNew.thoisunews.length; i++)
            dataTitle += ProcessReduplicateNew.thoisunews[i].title + '\n';
        fs.writeFile(path.join(__dirname + '/tokenizer/data/input.txt'), dataTitle, function(err){
            if (err) return console.log(err);
            console.log('File successfully written! - Check your project directory for the output.text file');

            console.log('Segment file');
            
            /*
            var exec = require('child_process').exec;
            var compileit = 'java -jar Demo.jar';
            exec(compileit, function(error, stdout, stderr) {
                console.log(stdout);
            });
            */
        }); 
        console.log("Need cacular: " + this.count);
        console.log("The gioi: " + this.thoigioinews.length);
        console.log("Kinh doanh: " + this.kinhdoanhnews.length);
        console.log("The thao: " + this.thethaonews.length);
        console.log("Cong nghe: " + this.congnghenews.length);
        console.log("Suc khỏe: " + this.suckhoenews.length);
        console.log("Phap luat: " + this.phatluatnews.length);
        console.log("Thoi su: " + ProcessReduplicateNew.thoisunews.length);
    }

    processCacularSimilar(new_1 : string, new_2 : string) : number{
        /*pre process*/
        //clear punctuation
        new_1 = this.clearPunctuation(new_1);
        new_2 = this.clearPunctuation(new_2);

        //segment word
        new_1 = this.bmmWordSegment.funcBMMSegment(new_1);
        new_2 = this.bmmWordSegment.funcBMMSegment(new_2);

        return 0.7;
    }

    clearPunctuation(txt: string) : string{
        return txt.replace("[=^+\\\\|\\[{\\]};:'`\".,<>/#!?()]*", "");
    }

}