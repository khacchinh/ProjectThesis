import * as Collections from 'typescript-collections';

const maxL  = 5; //max syllabic of word in dictionary is 5
export class BMMWordSegment {

	private hDisyllabic : Collections.Dictionary<string, number>;
  	private hMultisyllabic : Collections.Dictionary<string, number>;
  	private hPrefix : Collections.Dictionary<string, number>;
  	private hSuffix : Collections.Dictionary<string, number>;

  	private T_fmm : string = "";  //result of FMM
  	private T_bmm : string = "";  //result of BMM

  	private weight_fmm : number = 0;
  	private weight_bmm : number = 0;

  	private arr_sentence : Array<string>;
	
	constructor() {
		this.hMultisyllabic = new Collections.Dictionary<string, number>();
		this.hDisyllabic = new Collections.Dictionary<string, number>();
		this.hPrefix = new Collections.Dictionary<string, number>();
		this.hSuffix = new Collections.Dictionary<string, number>();

		this.arr_sentence = new Array<string>();
	}

	funcBMMSegment(quotation : string) : string{
		var result = "";
		this.arr_sentence = quotation.split(/\r?\n/);
		for (var index in this.arr_sentence){
			this.T_fmm = "";
			this.T_bmm = "";
			this.weight_fmm = 0;
			this.weight_bmm = 0;

			var arr_word = this.arr_sentence[index].split(" ");
			this.funcSegmentFMM(arr_word);
			this.funcSegmentBMM(arr_word);
 
			//compare weight fmm and bmm
			if (this.weight_fmm >= this.weight_bmm)
				result += this.T_fmm + "\n";
			else result += this.T_bmm + "\n";
		}
		return result;
	}

	private funcSegmentFMM(arr_word : Array<string>){
	    var i = 0; //current position
	    var l = 3; //number of syllables
	    var wi = 0;
	    var word = this.convertArrayToString(arr_word, i, l);
	    while ( i < arr_word.length){
	    	if (this.isPrefix(word) && l < maxL) l++;
	    	else {
	    		wi = this.isWord(word, l);
	    		if (wi > 0){
	    			this.T_fmm += word.replace(/ /g, "_") + " ";
	    			this.weight_fmm += wi
	    			i += l;
	    		} else{
	    			l = 2;
	    			word = this.convertArrayToString(arr_word, i, l);
	    			wi = this.isWord(word, l);
		    		if (wi > 0){
		    			this.T_fmm += word.replace(/ /g, "_") + " ";
		    			this.weight_fmm += wi
		    			i += l;
		    		} else{
		    			word = arr_word[i];
		    			this.T_fmm += word + " ";
		    			i++;
		    		}
		    		l = 3;
	    		}
	    	}
	    	word = this.convertArrayToString(arr_word, i, l);
	    }
  	}

	private funcSegmentBMM(arr_word : Array<string>){
		var i = arr_word.length - 1; //current position
	    var l = 3; //number of syllables
	    var wi = 0;
	    var word = this.convertArrayToString(arr_word, i - l + 1, l);
	    while ( i >= 0){
	    	if (this.isSuffix(word) && l < maxL) l++;
	    	else {
	    		wi = this.isWord(word, l);
	    		if (wi >= 0){
	    			this.T_bmm = word.replace(/ /g, "_") + " " + this.T_bmm;
	    			this.weight_bmm += wi
	    			i -= l;
	    		} else{
	    			l = 2;
	    			word = this.convertArrayToString(arr_word, i - l + 1, l);
	    			wi = this.isWord(word, l);
		    		if (wi > 0){
		    			this.T_bmm = word.replace(/ /g, "_") + " " + this.T_bmm;
		    			this.weight_bmm += wi
		    			i -= l;
		    		} else{
		    			word = arr_word[i];
		    			this.T_bmm = word + " " + this.T_bmm;
		    			i--;
		    		}
		    		l = 3;
	    		}
	    	}
	    	word = this.convertArrayToString(arr_word, i - l + 1, l);
	    }
  	}


	private isWord(word: string, number_of_syllable: number) : number{
		if (number_of_syllable > 2){
			word = word.toLowerCase();
			if (this.hMultisyllabic.containsKey(word))
	      		return this.hMultisyllabic.getValue(word);
	      	else return 0;
	    }
	    else{
	      if (this.hDisyllabic.containsKey(word))
	      		return this.hDisyllabic.getValue(word);
	      	else return 0;
	    }
	}

	private isPrefix(word : string) : boolean {
    	if (this.hPrefix.containsKey(word.toLowerCase()))
      		return true;
    	else return false;
  	}

  	private isSuffix(word : string) : boolean{
    	if (this.hSuffix.containsKey(word.toLowerCase()))
      		return true;
    	else return false;
  	}

  	private convertArrayToString(array :Array<string>, start_index: number, end_index : number) : string{
	    return array.slice(start_index,start_index + end_index).join(" "); 
	}

	funcAddhDisyllabic(key: string, value: number){
		this.hDisyllabic.setValue(key, value);
	}

	funcAddhMultisyllabic(key: string, value: number){
		this.hMultisyllabic.setValue(key, value);
	}

	funcAddhPrefix(key: string, value: number){
		this.hPrefix.setValue(key, value);
	}

	funcAddhSuffix(key : string, value: number){
		this.hSuffix.setValue(key, value);
	}
}