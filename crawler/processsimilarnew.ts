
import * as fs from 'fs';
import { ProcessNews } from './processnews';
import { News } from './News';
import { NewItem }  from '../model/NewsItem';
import * as path from 'path';

export class ProcessSimilarNew{

    private thoigioinews = new Array<News>();
    private kinhdoanhnews = new Array<News>();
    private thethaonews = new Array<News>();
    private congnghenews = new Array<News>();
    private suckhoenews = new Array<News>();
    private phapluatnews = new Array<News>();
    private thoisunews = new Array<News>();
    private arrstopword = new Array<string>();
    private variable_new_similar = "";

    constructor(){
        console.log("Length new: " + ProcessNews.arrNews.length);
        this.variable_new_similar += "=================================" + "\n";
        this.variable_new_similar += new Date() + "\n";
        this.variable_new_similar += "=================================" + "\n";
        this.funcMainCacularSimilar();
    }
//.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?‘’“”"…\n\r\t]/g," ")
    funcMainCacularSimilar(){
        //load stop word
        console.log('- load stop word');
        var stopword = fs.readFileSync(__dirname + '/tokenizer/data/stopword.txt');
        this.arrstopword = stopword.toString().split(/\r?\n/);

        //load title segment
        console.log('- load title segment');
        var dataTitle = fs.readFileSync(__dirname + '/tokenizer/data/output.txt');
        var arrDataTitle = dataTitle.toString().split("\n");

        //process
        console.log('- remove stop word and save title segment');
        for (var i = 0; i < ProcessNews.arrNews.length; i++){
            var str_segment = arrDataTitle[i].replace(/[.,\/#!$%\^&\*;:{}=\-`~()'?‘’“”"…]/g," ");
            str_segment = str_segment.replace( /  +/g, ' ' ).toLowerCase();
            ProcessNews.arrNews[i].content = str_segment;
            this.funcDivideNews(ProcessNews.arrNews[i], str_segment);
            
            if (i == ProcessNews.arrNews.length - 1){
                ProcessNews.arrNews.length = 0;
                ProcessNews.arOldNews.length = 0;
                ProcessNews.saveFlagTime = ProcessNews.arFlagTime;

                //save flag into file
                console.log('- save flag title in to file');
                console.log('- save flag time in to file');
                var flagTitle = "";
                var flagTime = "";
                ProcessNews.arFlagTitle.forEach((key, value) => {
                    value = value.replace(/[./]/g, "");
                    flagTitle += key + "/" + value.trim() + ".";
                });
                ProcessNews.arFlagTime.forEach((key, value) => {
                    flagTime += key + "/" + value + ".";
                });
                fs.writeFileSync(path.join(__dirname + '/tokenizer/data/flagTitle.txt'), flagTitle);
                fs.writeFileSync(path.join(__dirname + '/tokenizer/data/flagTime.txt'), flagTime); 

                console.log('- write similar news');
                fs.appendFileSync(path.join(__dirname + '/tokenizer/data/log_news_similar.txt'), this.variable_new_similar); 
            }
        }
    }

    funcDivideNews(news: News, title_segment: string){
        if (news.category == 'thế giới' || news.category == 'thế giới'){
            news.category = 'thế giới'
            this.funcImportNewByCategory(news, this.thoigioinews, title_segment);
        }
        else if (news.category == 'kinh doanh' || news.category == 'tài chính' || news.category == 'kinh tế'){
            news.category = 'kinh doanh';
            this.funcImportNewByCategory(news, this.kinhdoanhnews, title_segment);
        }
        else if (news.category == 'thể thao' || news.category == 'bóng đá'){
            news.category = 'thể thao';
            this.funcImportNewByCategory(news, this.thethaonews, title_segment);
        }
        else if (news.category == 'số hóa' || news.category == 'công nghệ' || news.category == 'dân trí'){
            news.category = 'công nghệ';
            this.funcImportNewByCategory(news, this.congnghenews, title_segment);
        }
        else if (news.category === "sức khỏe" || news.category === "sức khoẻ" ||  news.category == 'sống khỏe'){
            news.category = 'sức khỏe';
            this.funcImportNewByCategory(news, this.suckhoenews, title_segment);
        }
        else if (news.category == 'pháp luật' || news.category == 'hình sự' || news.category == 'pháp luật'){
            news.category = 'pháp luật';
            this.funcImportNewByCategory(news, this.phapluatnews, title_segment);
        }
        else if (news.category == 'thời sự' || news.category == 'tin nhanh' || news.category == 'chính trị'){
            news.category = 'thời sự';
            this.funcImportNewByCategory(news, this.thoisunews, title_segment);
        }
    }

    /*
    *
    * author: KhacChinhDev
    * 
    */
    funcImportNewByCategory(news : News, arrNew : Array<News>, title_segment : string){
        var count_same_author = 0;
        var similar = 0;
        if (arrNew.length == 0){
            news.arr_title_segment = this.funcArrayNonStopWord(title_segment);
            //check database if similar
                if (ProcessNews.arOldNews.length > 0) {
                    for (var i = 0; i < ProcessNews.arOldNews.length; i++){
                        //if (ProcessNews.arOldNews[i].category == news.category){
                            ProcessNews.arOldNews[i].arr_title_segment = this.funcArrayNonStopWord(ProcessNews.arOldNews[i].content);
                            similar = this.funcProcessCacularSimilar(title_segment, ProcessNews.arOldNews[i].arr_title_segment);
                            if (similar > 0.6){
                                console.log("Tên báo: " + news.author);
                                this.variable_new_similar += "Tên báo: " + news.author + "\n";
                                console.log("Thể loại: " + news.category);
                                this.variable_new_similar += "Thể loại: " + news.category + "\n";
                                console.log("Tiêu đề: " + news.title);
                                this.variable_new_similar += "Tiêu đề: " + news.title + "\n";
                                this.variable_new_similar += "URL: " + news.url + "\n";
                                this.variable_new_similar += "Date public: " + news.date_public.toLocaleDateString() + "\n";
                                console.log("---------------");
                                this.variable_new_similar += "---------------" + "\n";
                                console.log("Tên báo: " + ProcessNews.arOldNews[i].author);
                                this.variable_new_similar += "Tên báo: " + ProcessNews.arOldNews[i].author + "\n";
                                console.log("Thể loại: " + ProcessNews.arOldNews[i].category);
                                this.variable_new_similar += "Thể loại: " + ProcessNews.arOldNews[i].category + "\n";
                                console.log("Tiêu đề: " +   ProcessNews.arOldNews[i].title);
                                this.variable_new_similar += "Tiêu đề: " +   ProcessNews.arOldNews[i].title + "\n";
                                this.variable_new_similar += "URL: " + ProcessNews.arOldNews[i].url + "\n";
                                this.variable_new_similar += "Date public: " + ProcessNews.arOldNews[i].date_public.toLocaleDateString() + "\n";
                                console.log("----");
                                this.variable_new_similar += "----" + "\n";
                                console.log("Cosine value: " + similar);
                                this.variable_new_similar += "Cosine value: " + similar + "\n";
                                console.log("\n\n");
                                this.variable_new_similar += "\n\n";
                                return;
                            }                                 
                       // }
                    }
                }
            arrNew.push(news);
            this.funcSaveNew(news);
            return;
        }
        else{
            arrNew.forEach(old_news => {
                if (news.author == old_news.author){
                    count_same_author++;
                }
                    //cacular similar here
                else{
                   
                    //                    // call function cacular similar cosinse here
                    similar = this.funcProcessCacularSimilar(title_segment, old_news.arr_title_segment);
                    //
                    if (similar > 0.6){  
                         //delete new of news is reduplicate
                        console.log("Tên báo: " + news.author);
                        this.variable_new_similar += "Tên báo: " + news.author + "\n";
                        console.log("Thể loại: " + news.category);
                        this.variable_new_similar += "Thể loại: " + news.category + "\n";
                        console.log("Tiêu đề: " + news.title);
                        this.variable_new_similar += "Tiêu đề: " + news.title + "\n";
                        this.variable_new_similar += "URL: " + news.url + "\n";
                        this.variable_new_similar += "Date public: " + news.date_public.toLocaleDateString() + "\n";
                        console.log("---------------");
                        this.variable_new_similar += "---------------" + "\n";
                        console.log("Tên báo: " + old_news.author);
                        this.variable_new_similar += "Tên báo: " + old_news.author + "\n";
                        console.log("Thể loại: " + old_news.category);
                        this.variable_new_similar += "Thể loại: " + old_news.category + "\n";
                        console.log("Tiêu đề: " +   old_news.title);
                        this.variable_new_similar += "Tiêu đề: " +   old_news.title + "\n";
                        this.variable_new_similar += "URL: " + old_news.url + "\n";
                        this.variable_new_similar += "Date public: " + old_news.date_public.toLocaleDateString() + "\n";
                        console.log("----");
                        this.variable_new_similar += "----" + "\n";
                        console.log("Cosine value: " + similar);
                        this.variable_new_similar += "Cosine value: " + similar + "\n";
                        console.log("\n\n");
                        this.variable_new_similar += "\n\n";
                        return; 
                    }
                    count_same_author++;
                }
            });
            if (count_same_author == arrNew.length){
                news.arr_title_segment = this.funcArrayNonStopWord(title_segment);
                
               
                //check database if similar
                if (ProcessNews.arOldNews.length > 0) {
                    for (var i = 0; i < ProcessNews.arOldNews.length; i++){
                      //  if (ProcessNews.arOldNews[i].category == news.category){
                            ProcessNews.arOldNews[i].arr_title_segment = this.funcArrayNonStopWord(ProcessNews.arOldNews[i].content);
                            similar = this.funcProcessCacularSimilar(title_segment, ProcessNews.arOldNews[i].arr_title_segment);
                            if (similar > 0.6){
                                console.log("Tên báo: " + news.author);
                                this.variable_new_similar += "Tên báo: " + news.author + "\n";
                                console.log("Thể loại: " + news.category);
                                this.variable_new_similar += "Thể loại: " + news.category + "\n";
                                console.log("Tiêu đề: " + news.title);
                                this.variable_new_similar += "Tiêu đề: " + news.title + "\n";
                                this.variable_new_similar += "URL: " + news.url + "\n";
                                this.variable_new_similar += "Date public: " + news.date_public.toLocaleDateString() + "\n";
                                console.log("---------------");
                                this.variable_new_similar += "---------------" + "\n";
                                console.log("Tên báo: " + ProcessNews.arOldNews[i].author);
                                this.variable_new_similar += "Tên báo: " + ProcessNews.arOldNews[i].author + "\n";
                                console.log("Thể loại: " + ProcessNews.arOldNews[i].category);
                                this.variable_new_similar += "Thể loại: " + ProcessNews.arOldNews[i].category + "\n";
                                console.log("Tiêu đề: " +   ProcessNews.arOldNews[i].title);
                                this.variable_new_similar += "Tiêu đề: " +   ProcessNews.arOldNews[i].title + "\n";
                                this.variable_new_similar += "URL: " + ProcessNews.arOldNews[i].url + "\n";
                                this.variable_new_similar += "Date public: " + ProcessNews.arOldNews[i].date_public.toLocaleDateString() + "\n";
                                console.log("----");
                                this.variable_new_similar += "----" + "\n";
                                console.log("Cosine value: " + similar);
                                this.variable_new_similar += "Cosine value: " + similar + "\n";
                                console.log("\n\n");
                                this.variable_new_similar += "\n\n";
                                return;
                            }                                 
                       // }
                    }
                }
                
                /*
                *
                * save to db
                */
                arrNew.push(news);
                this.funcSaveNew(news);
            }
        }
    }

    /*
    * save new to db
    * author: KhacChinhDev
    * 
    */
    funcSaveNew(news : News){
        NewItem.saveNewItem(news).then(
            (msg : News) => {
              //  console.log(msg);
            }
        );
        
    }

    
    /*
    * cacular similar between two string
    * author: KhacChinhDev
    * return similar of two string
    */
    funcProcessCacularSimilar(title_segment_new : string, arr_title_segment_old: Array<string>) : number{
        var arr_title_segment_new = this.funcArrayNonStopWord(title_segment_new);
        // array union between item new and item ola
        var arr_union = arr_title_segment_new.concat(arr_title_segment_old);
        var arr_union_unique = arr_union.filter((element, index) => arr_union.indexOf(element) === index);
        
        //create vector of item new
        var arr_vector_tfidf_item_new = Array<number>();
        var arr_vector_orderword_item_new = Array<number>();
        arr_union_unique.forEach(element => {
            //tf-idf
            var tf_idf_word_new = this.funcTfWord(arr_title_segment_new, element) * 
                              this.funcIdfWord(arr_title_segment_new, arr_title_segment_old, element);
            arr_vector_tfidf_item_new.push(tf_idf_word_new);

            //order word
            var order_word_new = arr_title_segment_new.indexOf(element) >= 0 ? arr_title_segment_new.indexOf(element)+1 : 0;
            arr_vector_orderword_item_new.push(order_word_new);
        });

        //create vector of item old
        var arr_vector_tfidf_item_old = Array<number>();
        var arr_vector_orderword_item_old = Array<number>();
        arr_union_unique.forEach(element => {
            //tf-idf
            var tf_idf_word_old = this.funcTfWord(arr_title_segment_old, element) * 
                              this.funcIdfWord(arr_title_segment_new, arr_title_segment_old, element);
            arr_vector_tfidf_item_old.push(tf_idf_word_old);

            //order word
            var order_word_old = arr_title_segment_old.indexOf(element) >= 0 ? arr_title_segment_old.indexOf(element)+1 : 0;
            arr_vector_orderword_item_old.push(order_word_old);
        });
        //value cosine
        var value_cosine = this.funcCosineSimilar(arr_vector_tfidf_item_new, arr_vector_tfidf_item_old);

        //value orderword
        var value_orderword = this.funcOrderWord(arr_vector_orderword_item_new, arr_vector_orderword_item_old);
        
        /*
        if (value_cosine > 0.5) {
            console.log(arr_title_segment_new.join(" "));
            console.log(arr_vector_tfidf_item_new.join("/"));
            console.log("\n");
            console.log(arr_title_segment_old.join(" "));
            console.log(arr_vector_tfidf_item_old.join("/"));
            console.log("\n");
            console.log(arr_union_unique.join(" "));
            console.log(value_cosine);
            console.log("\n-------------------------------------");
            
        }
        //
        */
        return value_cosine *0.8 + value_orderword *0.2;
    }

    /*
    * cacular order word
    * author: KhacChinhDev
    * return value of order word
    */
    funcOrderWord(vector_new : Array<number>, vector_old : Array<number>) : number{
        var value_numerator = 0, value_denominator = 0;
        for (var i =0; i< vector_new.length; i++){
            value_numerator += Math.pow((vector_new[i]-vector_old[i]),2);
            value_denominator += Math.pow((vector_new[i]+vector_old[i]),2);
        }
        value_numerator = Math.sqrt(value_numerator);
        value_denominator = Math.sqrt(value_denominator);
        return 1 - (value_numerator/value_denominator);
    }

    /*
    * cacular cosine
    * author: KhacChinhDev
    * return value of cosine
    */

    funcCosineSimilar(vector_new : Array<number>, vector_old : Array<number>) : number{
        var value_new_old = 0, value_new = 0, value_old = 0;
        for (var i =0; i< vector_new.length; i++){
            value_new_old += vector_new[i]*vector_old[i];
            value_new += vector_new[i]*vector_new[i];
            value_old += vector_old[i]*vector_old[i];
        }

        return value_new_old / (Math.sqrt(value_new) * Math.sqrt(value_old));
    }

    /*
    * cacular tf word
    * author: KhacChinhDev
    * return tf of word
    */
    funcTfWord(arr: Array<string>, word :string) : number{
        var count = 0;
        arr.forEach(element => {
            if (element == word)
                count++;
        });
        return count / arr.length;
    }

    /*
    * cacular idf word
    * author: KhacChinhDev
    * return idf of word
    */

    funcIdfWord(arr_1 : Array<string>, arr_2 : Array<string>, word: string) : number {
        var count = 0;
        if (arr_1.indexOf(word) > -1)
            count++;
        if (arr_2.indexOf(word) > -1)
            count++;
        count++;
        return 1 + Math.log(2/count);
    }


    /*
    * remove all stop word in string
    * author: KhacChinhDev
    * return arr without stop word 
    */
    funcArrayNonStopWord(text: string) :Array<string>{
        var arr = text.split(" ");
        var arrNonSW = arr.filter( (el) =>{
            return this.arrstopword.indexOf(el) < 0;
        });
        //load non stop word
        return arrNonSW;
    }
}