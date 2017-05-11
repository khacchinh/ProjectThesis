import * as Crawler from 'crawler';
import * as url from 'url';
import * as fs from 'fs';

import { News } from './News';

import { ProcessNews } from './processnews';
import { NewItem }  from '../model/NewsItem';
//var bmm = new BMMWordSegment();

export class CrawlerNewsClass{

    constructor(){
        console.log("Length old: " + ProcessNews.arOldNews.length);
        //get flag title and date into variable
       // if (ProcessNews.arFlagTitle.size() > 0){
            ProcessNews.arFlagTitle.clear();
            ProcessNews.arFlagTime.clear();
            var flagTitle = fs.readFileSync(__dirname + '/tokenizer/data/flagTitle.txt');
            var flagTime = fs.readFileSync(__dirname + '/tokenizer/data/flagTime.txt');
            var arFlagTitle = flagTitle.toString().split(".");
            var arFlagTime = flagTime.toString().split(".");
            for(var i = 0; i< arFlagTitle.length; i++){
                if (arFlagTitle[i].trim() != ""){
                    var key = arFlagTitle[i].split("/")[0];
                    var valueTitle = arFlagTitle[i].split("/")[1];
                    var valueTime = arFlagTime[i].split("/")[1];
                    ProcessNews.arFlagTitle.setValue(key, valueTitle);
                    ProcessNews.arFlagTime.setValue(key, new Date(valueTime));
                    ProcessNews.saveFlagTime.setValue(key, new Date(valueTime));
                }
            }
      //  }
    }

    checkExistTitle(author: string, category: string, title: string){
        if (title +'' == "undefined")
            return false;
        var key = author.toLowerCase() + "-" + category.toLowerCase();
        if (ProcessNews.arFlagTitle.getValue(key) && ProcessNews.arFlagTitle.getValue(key).trim().toLowerCase() == title.trim().toLowerCase()){
            return true;
        }
        return false;
    }
    
    getCrawlerData() : Promise<boolean> {
        var __this = this;
        let p = new Promise<boolean> (function(resolve, reject){
            var title = '';
            var count = 0;
            var processNews : ProcessNews = new ProcessNews();
            var c = new Crawler({
                maxConnections: 50,
                callback: (error, res, done) => {
                    count ++;
                    if (error){
                        console.log(error);
                        reject(false);
                    }
                    else {
                        var $ = res.$;
                        //crawler news VnExpress
                        if ($('meta[name=author]').attr("content") == 'VnExpress'){
                            var news : News = new News();
                            var author = $('meta[name=author]').attr("content").toString();
                            var category= $('.timer_header').text().trim();
                            news.author = author;
                            news.category = category;
                            //new hot
                            news.title = $(".box_hot_news").children("h1").text().trim();
                            if (__this.checkExistTitle(news.author, news.category, news.title))
                                return false;
                            news.url = $(".box_hot_news").children("h1").children("a").attr('href');
                            news.img = $(".box_hot_news").children().first().children().children().attr('src');
                            news.type_img = true;
                            news.sumary = $(".box_hot_news").children("h4").text().trim();
                            processNews.importNew(news);
                            $(".list_news ").children().each(function(i, element){
                                var data = $(this);
                                news  = new News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children().children().first().text().trim(); 
                                if (__this.checkExistTitle(news.author, news.category, news.title))
                                    return false;
                                news.url = data.children().children('.thumb').children().attr('href'); 
                                news.img = data.children().children('.thumb').children().children().attr('src');
                                news.sumary = data.children().children('.news_lead').text().trim(); 
                                processNews.importNew(news);
                            });
                            
                        }
                        //crawler news DanTri
                        else if ($('meta[name=author]').attr("content") == 'VCCorp.vn'){
                            var news : News = new News();
                            let author = "dantri"
                            var categorys = $('meta[name=keywords]').attr("content");

                            news.author = author;
                            var category = categorys.toString().split(",")[0];
                            news.category = category;

                            //new hot
                            news.title = $('.fl.wid470').children().children().first().attr('title');
                            if (__this.checkExistTitle(news.author, news.category, news.title))
                                return false;
                            news.type_img = true;
                            news.url = 'http://dantri.com.vn/' + $('.fl.wid470').children().children().first().attr('href');
                            news.img = $('.fl.wid470').children().children().first().children().attr('src');
                            $('.fl.wid470').children().children(".mr1").children("div").children("a").empty();
                            news.sumary = $('.fl.wid470').children().children(".mr1").children("div").text().trim();
                            processNews.importNew(news);

                            $("#listcheckepl").children().each(function(i, element){
                                var data = $(this);
                                var temp = data.children().first().attr('title') + '';
                                if (temp != 'undefined'){
                                    news = new News();

                                    news.author = author;
                                    news.category = category;
                                    
                                    news.title = temp;
                                    if (__this.checkExistTitle(news.author, news.category, news.title))
                                        return false;
                                    news.url = 'http://dantri.com.vn/' + data.children().first().attr('href');
                                    news.img = data.children().first().children().attr('src');
                                    data.children().last().children("div").children("a").empty();
                                    news.sumary = data.children().last().children("div").text().trim();
                                    processNews.importNew(news);
                                }
                            });
                        }
                        //crawler news VietNamNet
                        else if ($('meta[name=author]').attr("content") == 'VietNamNet News'){
                            var news : News = new News();
                            var author = $('meta[name=author]').attr("content");
                            var category = $('.CateTitle.left').text();

                            news.author = author;
                            news.category = category;

                            //new hot
                            news.title = $('.TopArticle').children().first().children().attr('title');
                            if (__this.checkExistTitle(news.author, news.category, news.title))
                                return false;
                            news.type_img = true;
                            news.url = 'http://vietnamnet.vn' +$('.TopArticle').children().first().children().attr('href');
                            news.img = $('.TopArticle').children().first().children().children().attr('src');
                            news.sumary = $('.TopArticle').children().last().text().trim();
                            processNews.importNew(news);

                            //new hot
                            $('.ListHeight.m-t-10').children().each(function(i, element){
                                var data = $(this);
                                news = new News();

                                news.author = author;
                                news.category = category;

                                news.title = data.children().first().attr('title');
                                if (__this.checkExistTitle(news.author, news.category, news.title))
                                    return false;
                                news.url = 'http://vietnamnet.vn' + data.children().first().attr('href');
                                news.img = data.children().first().children().attr('src');
                                news.sumary = data.children().first().attr('title');
                                processNews.importNew(news);
                            });

                            $('.ListArticle').children().each(function(i, element){
                                var data = $(this);
                                news = new News();

                                news.author = author;
                                news.category = category;

                                news.title = data.children().first().attr('title');
                                if (__this.checkExistTitle(news.author, news.category, news.title))
                                    return false;
                                news.url = 'http://vietnamnet.vn' + data.children().first().attr('href');
                                news.img = data.children().first().children().attr('src');
                                news.sumary = data.children().last().text().trim();
                                processNews.importNew(news);
                            });
                        }
                        //crawler news ThanhNien
                        else if ($(".logo").first().text() == "Thanh Niên"){
                            var news : News = new News();
                            var author : any = "ThanhNien";
                            var category = $('.drt-cate').text();

                            news.author = author;
                            news.category = category;

                            //new hot
                            news.title = $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('title');
                            if (__this.checkExistTitle(news.author, news.category, news.title))
                                return false;
                            news.type_img = true;
                            news.url = 'http://thanhnien.vn' + $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('href');
                            news.img = $('.subcate-highlight-ctn.clearfix').children().children().first().children().children().attr('src');
                            news.sumary = $('.subcate-highlight-ctn.clearfix').children().children().first().children().attr('title');
                            processNews.importNew(news);

                            //new hot
                            $('.subcate-highlight.clearfix').children('article').each(function(i, element){
                                var data = $(this);
                                news = new News();

                                news.author = author;
                                news.category = category;

                                news.title = data.children().first().children().attr('title');
                                if (__this.checkExistTitle(news.author, news.category, news.title))
                                    return false;
                                news.url = 'http://thanhnien.vn' +data.children().first().children().attr('href');
                                news.img = data.children().first().children().children().attr('src');
                                news.sumary = data.children().last().text().trim();
                                processNews.importNew(news);
                            });

                            $('.cate-list').children().each(function(i, element){
                                var data = $(this);
                                news = new News();

                                news.author = author;
                                news.category = category;
                                
                                news.title = data.children("figure").children().attr('title');
                                if (__this.checkExistTitle(news.author, news.category, news.title))
                                    return false;
                                news.url = 'http://thanhnien.vn' +data.children("figure").children().attr('href');
                                news.img = data.children("figure").children().children().attr('src');
                                news.sumary = data.children().last().text().trim();
                                processNews.importNew(news);
                            });
                        }   
                        //crawler news Zing
                        else if ($('meta[name=author]').attr("content") == 'ZING.VN'){
                            var author :any = "zing";
                            var category = $('#mainContent_ctl00_Breadcumb1_hlTitle').text().trim();
                             
                            //hot new
                            $("section.featured").children().each(function(i, element){
                                var data = $(this);
                                var news : News = new News();
                                news.author = author;
                                news.category = category;
            
                                news.title = data.children("header").children(".title").children("a").text();
                                news.title = news.title.trim();
                                news.url = "http://news.zing.vn" + data.children("header").children(".title").children("a").attr('href');
                                news.sumary = data.children("header").children(".summary").text();
                                news.img = data.children(".cover").children().children().attr('src');
                                
                                if (i == 0)
                                    news.type_img = true;
                                processNews.importNew(news);
                            });

                            $('section.cate_content').children('article').each(function(i, element){
                                var data = $(this);
                                var news : News = new News();
                                news.author = author;
                                news.category = category;
                                news.title = data.children("header").children(".title").children("a").text();
                                news.title = news.title.trim();
                                if (__this.checkExistTitle(news.author, news.category, news.title))
                                    return false;
                                news.url = "http://news.zing.vn" + data.children("header").children(".title").children("a").attr('href');
                                news.sumary = data.children("header").children(".summary").text();
                                news.img = data.children(".cover").children().children().attr('src');
                                processNews.importNew(news);
                            })
                        }   
                        //tuoitre
                        
                        else{
                            var author :any = "tintuc";
                            var category = $('meta[name=keywords]').attr("content");
                            category = category.split(",")[0];
                            $(".w-body.list").children().each(function(i, element){
                                var data = $(this);
                                var news : News = new News();
                                news.author = author;
                                news.category = category;

                                news.title = data.children(".media-left").children().attr("title");
                                news.url = data.children(".media-left").children().attr("href");
                                news.img = data.children(".media-left").children().children().attr("src");
                                news.sumary = data.children(".media-body").children("p.sapo").text();
                                /*
                                console.log(news.category);
                                console.log(news.title);
                                console.log(news.url);
                                console.log(news.img);
                                console.log(news.sumary + "\n\n");
                                */

                                processNews.importNew(news);
                            })   
                        }    
                         
                    }
                    if (count == 35){
                        resolve(true);
                    }
                    
                }
            });
            c.queue([
                //thế giới
                
                'http://vnexpress.net/tin-tuc/the-gioi',
                'http://dantri.com.vn/the-gioi.htm',
                'http://vietnamnet.vn/vn/the-gioi/',
                'http://thanhnien.vn/the-gioi/',
                'http://news.zing.vn/the-gioi.html',
                'http://tintuc.vn/the-gioi',   
                
                //kinh doanh
                
                'http://kinhdoanh.vnexpress.net/',
                'http://dantri.com.vn/kinh-doanh.htm',
                'http://vietnamnet.vn/vn/kinh-doanh/',
                'http://thanhnien.vn/kinh-doanh/',
                'http://news.zing.vn/kinh-doanh-tai-chinh.html',
                'http://tintuc.vn/kinh-doanh',
                
                //thể thao
                
                'http://thethao.vnexpress.net/',
                'http://dantri.com.vn/the-thao.htm',
                'http://vietnamnet.vn/vn/the-thao/',
                'http://thethao.thanhnien.vn/',
                'http://news.zing.vn/the-thao.html',
                'http://tintuc.vn/the-thao',
                
                //công nghệ
                
                'http://sohoa.vnexpress.net/',
                'http://dantri.com.vn/suc-manh-so.htm',
                'http://vietnamnet.vn/vn/cong-nghe/',
                'http://thanhnien.vn/cong-nghe/',
                'http://news.zing.vn/cong-nghe.html',
                'http://tintuc.vn/cong-nghe-so',
                
                //sức khỏe
                
                'http://suckhoe.vnexpress.net/',
                'http://dantri.com.vn/suc-khoe.htm',
                'http://vietnamnet.vn/vn/suc-khoe/',
                'http://thanhnien.vn/suc-khoe/',
                'http://news.zing.vn/suc-khoe.html',
                'http://tintuc.vn/suc-khoe',
                
                
                //pháp luật
                'http://vnexpress.net/tin-tuc/phap-luat',
                'http://dantri.com.vn/phap-luat.htm',
                'http://vietnamnet.vn/vn/phap-luat/',
                'http://news.zing.vn/phap-luat.html',
                'http://tintuc.vn/phap-luat',
                
                
                //thời sự
                /*
                'http://vnexpress.net/tin-tuc/thoi-su',
                'http://dantri.com.vn/su-kien.htm',
                'http://vietnamnet.vn/vn/thoi-su/',
                'http://thanhnien.vn/thoi-su/',
                'http://news.zing.vn/thoi-su.html',
                'http://tuoitre.vn/tin/chinh-tri-xa-hoi',
                */
                
            ]);
       });
       return p;
    }
}