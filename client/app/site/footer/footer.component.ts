import { Component } from '@angular/core';

declare var $: any;
@Component({
    moduleId: module.id,
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent { 


	onGoTop(){
		var body = $("html, body");
		body.stop().animate({scrollTop:0}, 1000, 'swing');
	}
}