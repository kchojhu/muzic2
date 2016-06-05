import { Injectable, ElementRef} from '@angular/core';

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