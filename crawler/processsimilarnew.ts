
import * as fs from 'fs';
import { ProcessNews } from './processnews';
import { News } from './News';
import { NewItem }  from '../model/NewsItem';

export class ProcessSimilarNew{

    private thoigioinews = new Array<News>();
    private kinhdoanhnews = new Array<News>();
    private thethaonews = new Array<News>();
    private congnghenews = new Array<News>();
    private suckhoenews = new Array<News>();
    private phapluatnews = new Array<News>();
    private thoisunews = new Array<News>();
    private arrstopword = new Array<string>();

    constructor(){
        console.log("Length new: " + ProcessNews.arrNews.length);
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
            str_segment = str_segment.replace( /  +/g, ' ' );
            ProcessNews.arrNews[i].content = str_segment.toLowerCase();
            this.funcDivideNews(ProcessNews.arrNews[i], str_segment);
            
            if (i == ProcessNews.arrNews.length - 1){
                ProcessNews.arrNews.length = 0;
                ProcessNews.tempArrNews.length = 0;
                ProcessNews.arOldNews.length = 0;
            }
        }
    }

    funcDivideNews(news: News, title_segment: string){
        title_segment = title_segment.toLowerCase();
        if (news.category.toLowerCase() == 'thế giới'){
            this.funcImportNewByCategory(news, this.thoigioinews, title_segment);
        }
        else if (news.category.toLowerCase() == 'kinh doanh' || news.category.toLowerCase() == 'tài chính'){
            this.funcImportNewByCategory(news, this.kinhdoanhnews, title_segment);
        }
        else if (news.category.toLowerCase() == 'thể thao' || news.category.toLowerCase() == 'bóng đá'){
            this.funcImportNewByCategory(news, this.thethaonews, title_segment);
        }
        else if (news.category.toLowerCase() == 'số hóa' || news.category.toLowerCase() == 'công nghệ' || news.category.toLowerCase() == 'dân trí'){
            this.funcImportNewByCategory(news, this.congnghenews, title_segment);
        }
        else if (news.category.toLowerCase() === "sức khỏe" || news.category.toLowerCase() === "sức khoẻ"){
            this.funcImportNewByCategory(news, this.suckhoenews, title_segment);
        }
        else if (news.category.toLowerCase() == 'pháp luật' || news.category.toLowerCase() == 'hình sự'){
            this.funcImportNewByCategory(news, this.phapluatnews, title_segment);
        }
        else if (news.category.toLowerCase() == 'thời sự' || news.category.toLowerCase() == 'tin nhanh'){
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
                            if (similar > 0.45){
                                console.log("Tên báo: " + news.author);
                                console.log("Thể loại: " + news.category);
                                console.log("Tiêu đề: " + news.title);
                                console.log("---------------");
                                console.log("Tên báo: " + ProcessNews.arOldNews[i].author);
                                console.log("Thể loại: " + ProcessNews.arOldNews[i].category);
                                console.log("Tiêu đề: " +   ProcessNews.arOldNews[i].title);
                                console.log("----");
                                console.log("Cosine value: " + similar);
                                console.log("\n\n");
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
                    if (similar > 0.45){  
                         //delete new of news is reduplicate
                        console.log("Tên báo: " + news.author);
                        console.log("Thể loại: " + news.category);
                        console.log("Tiêu đề: " + news.title);
                        console.log("---------------");
                        console.log("Tên báo: " + old_news.author);
                        console.log("Thể loại: " + old_news.category);
                        console.log("Tiêu đề: " +   old_news.title);
                        console.log("----");
                        console.log("Cosine value: " + similar);
                        console.log("\n\n");
                        
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
                            if (similar > 0.45){
                                console.log("Tên báo: " + news.author);
                                console.log("Thể loại: " + news.category);
                                console.log("Tiêu đề: " + news.title);
                                console.log("---------------");
                                console.log("Tên báo: " + ProcessNews.arOldNews[i].author);
                                console.log("Thể loại: " + ProcessNews.arOldNews[i].category);
                                console.log("Tiêu đề: " +   ProcessNews.arOldNews[i].title);
                                console.log("----");
                                console.log("Cosine value: " + similar);
                                console.log("\n\n");
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