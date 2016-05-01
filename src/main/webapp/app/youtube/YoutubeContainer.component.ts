///<reference path="../../../../../typings/browser/ambient/greensock/greensock.d.ts"/>

import { Component, AfterViewInit, ElementRef} from 'angular2/core';

@Component({
    selector: '[youtubeContainer]',
    template: `
        Nain9
  `
})
export class YoutubeContainer implements AfterViewInit{
    
    constructor(private element:ElementRef ) {
        console.log('created Youtube Container');
    }
    
    ngAfterViewInit() {
        TweenMax.to(this.element.nativeElement, 0.5, {'margin-left': '+=200', ease: Power1.easeOut});
 //        Tween.
//        debugger;
    }

}
