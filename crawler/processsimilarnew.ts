
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

    //count author
    private cvnexpress : any = 0;
    private cdantri : any = 0;
    private cthanhnien : any = 0;
    private cvietnamnet : any = 0;
    private czing : any = 0;
    private ctintuc : any = 0;
    //end count

    constructor(){
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

        //load content segment
        console.log('- load content segment');
        var dataContent = fs.readFileSync(__dirname + '/tokenizer/data/output.txt');
        var arrDataContent = dataContent.toString().split("\n");

        //process
        console.log('- remove stop word and process remove similar new');
        console.log('- processing remove similar new');
        for (var i = 0; i < ProcessNews.arrNews.length; i++){
            var str_segment = arrDataContent[i].replace(/[.,\/#!$%\^&\*;:{}=\-`~()'?‘’“”"…]/g," ");
            str_segment = str_segment.replace( /\s+/g, ' ' ).toLowerCase();
            ProcessNews.arrNews[i].content = str_segment.trim();
            this.funcDivideNews(ProcessNews.arrNews[i]);
            
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

                console.log('- write log similar news');
                fs.appendFileSync(path.join(__dirname + '/tokenizer/data/log_news_similar.txt'), this.variable_new_similar); 


                //print count
                // console.log("VnExpress: " + this.cvnexpress);
                // console.log("Dantri: " + this.cdantri);
                // console.log("Thanhnien: " + this.cthanhnien);
                // console.log("VietnamNet: " + this.cvietnamnet);
                // console.log("Zing: " + this.czing);
                // console.log("Tintuc: " + this.ctintuc);
                //end print
            }
        }
    }

    funcDivideNews(news: News){
        //count
        switch (news.author){
            case 'vnexpress':
                this.cvnexpress += 1;
                break;
            case 'dantri':
                this.cdantri += 1;
                break;
            case 'thanhnien':
                this.cthanhnien += 1;
                break;
            case 'vietnamnet news':
                this.cvietnamnet += 1;
                break;
            case 'zing':
                this.czing += 1;
                break;
            case 'tintuc':
                this.ctintuc += 1;
                break;
        }
        //end count


        if (news.category == 'thế giới' || news.category == 'tin the gioi'){
            news.category = 'thế giới'
            this.funcImportNewByCategory(news, this.thoigioinews);
        }
        else if (news.category == 'kinh doanh' || news.category == 'tài chính' || news.category == 'kinh tế'){
            news.category = 'kinh doanh';
            this.funcImportNewByCategory(news, this.kinhdoanhnews);
        }
        else if (news.category == 'thể thao' || news.category == 'bóng đá' || news.category == 'the thao'){
            news.category = 'thể thao';
            this.funcImportNewByCategory(news, this.thethaonews);
        }
        else if (news.category == 'số hóa' || news.category == 'công nghệ' || news.category == 'dân trí' || news.category == 'tin cong nghe'){
            news.category = 'công nghệ';
            this.funcImportNewByCategory(news, this.congnghenews);
        }
        else if (news.category == "sức khỏe" || news.category == "suc khoe" ||  news.category == 'sống khỏe' || news.category == "sức khoẻ"){
            news.category = 'sức khỏe';
            this.funcImportNewByCategory(news, this.suckhoenews);
        }
        else if (news.category == 'pháp luật' || news.category == 'hình sự' || news.category == 'phap luat'){
            news.category = 'pháp luật';
            this.funcImportNewByCategory(news, this.phapluatnews);
        }
        else if (news.category == 'thời sự' || news.category == 'tin nhanh' || news.category == 'chính trị'){
            news.category = 'thời sự';
            this.funcImportNewByCategory(news, this.thoisunews);
        }
    }

    /*
    *
    * author: KhacChinhDev
    * 
    */
    funcImportNewByCategory(news : News, arrNew : Array<News>){
        var count_same_author = 0;
        var similar = 0;
        if (arrNew.length == 0){
            //check database if similar
            if (ProcessNews.arOldNews.length > 0) {
                for (var i = 0; i < ProcessNews.arOldNews.length; i++){
                    if (ProcessNews.arOldNews[i].category === news.category){
                        ProcessNews.arOldNews[i].arr_content_segment = this.funcArrayNonStopWord(ProcessNews.arOldNews[i].content);
                        similar = this.funcProcessCacularSimilar(news.content, ProcessNews.arOldNews[i].arr_content_segment);
                        similar = this.round(similar, 4);
                        if (similar > 0.7){
                            this.printResult(news, ProcessNews.arOldNews[i], similar);
                            return;
                        }                                 
                    }
                }
            }

            news.arr_content_segment = this.funcArrayNonStopWord(news.content);
            arrNew.push(news);
            this.funcSaveNew(news);
            return;
        }
        else{
            arrNew.forEach(old_news => {
                if (news.author == old_news.author)
                    count_same_author++;
                else {
                    similar = this.funcProcessCacularSimilar(news.content, old_news.arr_content_segment);
                    similar = this.round(similar, 4);
                    if (similar > 0.7){  
                             //delete new of news is reduplicate
                        this.printResult(news, old_news, similar);
                        return; 
                    }
                    count_same_author++;
                }
            });
            if (count_same_author == arrNew.length){
                //check database if similar
                if (ProcessNews.arOldNews.length > 0) {
                    for (var i = 0; i < ProcessNews.arOldNews.length; i++){
                        if (ProcessNews.arOldNews[i].category === news.category){
                            ProcessNews.arOldNews[i].arr_content_segment = this.funcArrayNonStopWord(ProcessNews.arOldNews[i].content);
                            similar = this.funcProcessCacularSimilar(news.content, ProcessNews.arOldNews[i].arr_content_segment);
                            similar = this.round(similar, 4);
                            if (similar > 0.7){
                                this.printResult(news, ProcessNews.arOldNews[i], similar);
                                return;
                            }                                 
                        }
                    }
                }
                
                /*
                *
                * save to db
                */
                news.arr_content_segment = this.funcArrayNonStopWord(news.content);
                arrNew.push(news);
                this.funcSaveNew(news);
            }
        }
    }

    /*
    * save new to db
    * author: KhacChinhDev
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
    funcProcessCacularSimilar(content_segment_new : string, arr_content_segment_old: Array<string>) : number{
        var arr_content_segment_new = this.funcArrayNonStopWord(content_segment_new);
        // array union between item new and item ola
        var arr_union_unique = arr_content_segment_new.concat(arr_content_segment_old);
        arr_union_unique = arr_union_unique.filter((element, index) => arr_union_unique.indexOf(element) === index);
        
        //create vector of item new
        var arr_vector_tfidf_item_new = Array<number>();
        var arr_vector_orderword_item_new = Array<number>();
        var arr_vector_tfidf_item_old = Array<number>();
        var arr_vector_orderword_item_old = Array<number>();
        arr_union_unique.forEach(element => {
            //new
            //tf-idf new
            var tf_idf_word_new = this.funcTfWord(arr_content_segment_new, element) * 
                              this.funcIdfWord(arr_content_segment_new, arr_content_segment_old, element);
            arr_vector_tfidf_item_new.push(tf_idf_word_new);

            //order word old
            var order_word_new = arr_content_segment_new.indexOf(element) >= 0 ? arr_content_segment_new.indexOf(element)+1 : 0;
            arr_vector_orderword_item_new.push(order_word_new);


            //old
            //tf-idf new
            var tf_idf_word_old = this.funcTfWord(arr_content_segment_old, element) * 
                              this.funcIdfWord(arr_content_segment_new, arr_content_segment_old, element);
            arr_vector_tfidf_item_old.push(tf_idf_word_old);

            //order word old
            var order_word_old = arr_content_segment_old.indexOf(element) >= 0 ? arr_content_segment_old.indexOf(element)+1 : 0;
            arr_vector_orderword_item_old.push(order_word_old);
        });

        //value cosine
        var value_cosine = this.funcCosineSimilar(arr_vector_tfidf_item_new, arr_vector_tfidf_item_old);

        //value orderword
        var value_orderword = this.funcOrderWord(arr_vector_orderword_item_new, arr_vector_orderword_item_old);
        
        /*
        if (value_cosine > 0.5) {
            console.log(arr_content_segment_new.join(" "));
            console.log(arr_vector_tfidf_item_new.join("/"));
            console.log("\n");
            console.log(arr_content_segment_old.join(" "));
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

    // print result 
    printResult(news: News, old: News, similar : number) {
        console.log("Tên báo: " + news.author);
        this.variable_new_similar += "Tên báo: " + news.author + "\n";
        console.log("Thể loại: " + news.category);
        this.variable_new_similar += "Thể loại: " + news.category + "\n";
        console.log("Tiêu đề: " + news.title);
        this.variable_new_similar += "Tiêu đề: " + news.title + "\n";
        this.variable_new_similar += "URL: " + news.url + "\n";
        this.variable_new_similar += "Date public: " + news.date_public.toLocaleDateString() + "\n";
        this.variable_new_similar += "Content: " + news.content + "\n";
        console.log("---------------");
        this.variable_new_similar += "---------------" + "\n";
        console.log("Tên báo: " + old.author);
        this.variable_new_similar += "Tên báo: " + old.author + "\n";
        console.log("Thể loại: " + old.category);
        this.variable_new_similar += "Thể loại: " + old.category + "\n";
        console.log("Tiêu đề: " +   old.title);
        this.variable_new_similar += "Tiêu đề: " +   old.title + "\n";
        this.variable_new_similar += "URL: " + old.url + "\n";
        this.variable_new_similar += "Date public: " + old.date_public.toLocaleDateString() + "\n";
        this.variable_new_similar += "Content: " + old.content + "\n";
        console.log("----");
        this.variable_new_similar += "----" + "\n";
        console.log("Cosine value: " + similar);
        this.variable_new_similar += "Cosine value: " + similar + "\n";
        console.log("\n\n");
        this.variable_new_similar += "\n\n";
    }

    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}