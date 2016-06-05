import { Injectable, ElementRef} from '@angular/core';

@Injectable()
export class ApplicationUtil {
    
    constructor() {

    }
     
    showLoad() {
        $('#loader').show();    
    }

    hideLoad() {
        $('#loader').hide();    
    }

    focusComponent(elementRef:ElementRef, width?:number) {
        let element = $(elementRef.nativeElement);
        if (!width) {
            element.width($(window).width());
        }
    }
}