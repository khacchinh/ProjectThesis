import { Component, OnInit } from '@angular/core';
import { BMMWordSegment } from './BMMWordSegment';

declare var $ : any;
declare var CJSON : any;

@Component({
    moduleId: module.id,
    templateUrl: 'wordsegment.component.html'
})

export class WordSegmentComponent{
    private textValue = "";
    private textValueDict = "";
    private output = "";
    private timerun = "0.0 giây";
    private time_read_dictionary = 0;
    private accury = "1";
    private time_each_run = 0;

    private bmmWordSegment : BMMWordSegment = new BMMWordSegment();
    ngOnInit(){
        var seft = this;
        var type = 1;
        $.get('/getDictionary', function(data: any){
            
            
          //var a = performance.now();
          var word, word_arr;
          //var string = LZString.decompress(stringLZ);
          var mmDict = CJSON.parse(data);
          
          
          var words = mmDict['2']['words'];
          var wi = mmDict['2']['wi'];
          var wi_n = mmDict['2']['wi_n'];
          for (var i = 0; i < words.length;i++ ){
            seft.bmmWordSegment.funcAddhDisyllabic(words[i], parseFloat(wi[i]));
            seft.bmmWordSegment.funcAddhDisyllabic(seft.removeAcen(words[i]), parseFloat(wi_n[i]));
          }
 

          var words = mmDict['3']['words'];
          var wi = mmDict['3']['wi'];
          var wi_n = mmDict['3']['wi_n'];
          for (var i = 0; i < words.length;i++ ){
            seft.bmmWordSegment.funcAddhMultisyllabic(words[i], parseFloat(wi[i]));
            seft.bmmWordSegment.funcAddhMultisyllabic(seft.removeAcen(words[i]), parseFloat(wi_n[i]));
          }

          var words = mmDict['4']['words'];
          var wi = mmDict['4']['wi'];
          var wi_n = mmDict['4']['wi_n'];
          for (var i = 0; i < words.length;i++ ){
            seft.bmmWordSegment.funcAddhMultisyllabic(words[i], parseFloat(wi[i]));
            seft.bmmWordSegment.funcAddhMultisyllabic(seft.removeAcen(words[i]), parseFloat(wi_n[i]));
            word_arr = words[i].split(' ');
            word = word_arr.slice(0, 3).join(' ');
            seft.bmmWordSegment.funcAddhPrefix(word, 0);
            seft.bmmWordSegment.funcAddhPrefix(seft.removeAcen(word), 0);
            word = word_arr.slice(1, 4).join(' ');
            seft.bmmWordSegment.funcAddhSuffix(word, 0);
            seft.bmmWordSegment.funcAddhSuffix(seft.removeAcen(word), 0);
          }

          var words = mmDict['5']['words'];
          var wi = mmDict['5']['wi'];
          var wi_n = mmDict['5']['wi_n'];
          for (var i = 0; i < words.length;i++ ){
            seft.bmmWordSegment.funcAddhMultisyllabic(words[i], parseFloat(wi[i]));
            seft.bmmWordSegment.funcAddhMultisyllabic(seft.removeAcen(words[i]), parseFloat(wi_n[i]));
            word_arr = words[i].split(' ');
            word = word_arr.slice(0, 3).join(' ');
            seft.bmmWordSegment.funcAddhPrefix(word, 0);
            seft.bmmWordSegment.funcAddhPrefix(seft.removeAcen(word), 0);
            word = word_arr.slice(0, 4).join(' ');
            seft.bmmWordSegment.funcAddhPrefix(word, 0);
            seft.bmmWordSegment.funcAddhPrefix(seft.removeAcen(word), 0);
            word = word_arr.slice(1, 5).join(' ');
            seft.bmmWordSegment.funcAddhSuffix(word, 0);
            seft.bmmWordSegment.funcAddhSuffix(seft.removeAcen(word), 0);
            word = word_arr.slice(2, 5).join(' ');
            seft.bmmWordSegment.funcAddhSuffix(word, 0);
            seft.bmmWordSegment.funcAddhSuffix(seft.removeAcen(word), 0);
          }
        });
         
    }
   

    removeAcen( word : string ) : string
    {
        var str = word;
        str= str.toLowerCase(); 
        str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str= str.replace(/đ/g,"d");
        return str;
    }
    //đọc dữ liệu cần tách từ
  onChange($event : any){
    this.textValue = "";
    this.output = "";
    this.accury = "";
    this.time_each_run = 0;
    this.readThis($event.target);
  }

  private readFile = (file : any) => {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = (event) => {
        file.data = reader.result;
        resolve(file.data);
      };

      reader.onerror = () => {
        return reject(this);
      };

      if (/^image/.test(file.type)) {
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }

    })

  };

  //hàm tách từ
  readThis(inputValue: any) :void {
    var seft = this;
    var file:File;
    seft.timerun = "Running.....";
    var counter = -1;
    var arr_sentence : Array<string>;
    while ( file = inputValue.files[ ++counter ] ) {
      var reader = seft.readFile(file);
      reader.then(function(value){
          seft.textValue += value + "\n"; 
          var a = performance.now();
          seft.output += seft.bmmWordSegment.funcBMMSegment(value.toString());
          var b = performance.now();
          seft.time_each_run += b - a;
          seft.timerun = "This take " + seft.time_each_run/1000 + " (s) to segment." + " Time load dictionary: " + seft.time_read_dictionary/1000 + "(s).";          
      })
    }
  }
}