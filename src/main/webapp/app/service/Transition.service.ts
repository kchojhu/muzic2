import { Injectable} from 'angular2/core';
import { ElementRef} from 'angular2/core';

@Injectable()
export class Transition {
    constructor() {}
     
        
    focusComponent(elementRef:ElementRef, width?:number) {
        let element = $(elementRef.nativeElement);
        if (!width) {
            element.width($(window).width());
        }
    }
}