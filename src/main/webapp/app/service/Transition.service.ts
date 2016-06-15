import { Injectable, ElementRef} from '@angular/core';
import {App} from '../App';


@Injectable()
export class Transition {
       
    private currentElement: ElementRef;
    private appElement: ElementRef;
    private mainElement: ElementRef;
    private transitionPeriod : number = 0.6;
    private transitionType : Ease = Power2.easeOut;
    private elementPositions : Array<ElementRef>;
    private app: App;
    private leftNavButton: JQuery;
    private rightNavButton: JQuery;
     
    constructor() {
        this.elementPositions = new Array<ElementRef>();
        $(window).on('hashchange', this.hashchange.bind(this));            
    }
    
    hashchange() {
        let hash = location.hash.slice(1);

        if (hash.indexOf('Container') > 0) {            
            this.focusComponent(this.getAppElement(hash));
        }

    }
    
    getAppElement(elementId:string) : ElementRef {
        return this.elementPositions.find(elementRef => {
            return elementRef.nativeElement.id === elementId;
        });
    }
    
    setAppElement(app: App) {
        this.appElement = app.getElement();
        this.app = app;
        this.elementPositions.push(app.songListContainer.getElement());
        this.elementPositions.push(app.youtubeContainer.getElement());
        this.elementPositions.push(app.playListContainer.getElement());

    }
        
    focusComponent(elementRef:ElementRef) {
        this.leftNavButton = this.leftNavButton ? this.leftNavButton : $('#leftNavButton');
        this.rightNavButton = this.rightNavButton ? this.rightNavButton : $('#rightNavButton');
        console.log('focus');
        console.log(elementRef);
        this.currentElement = this.currentElement ? this.currentElement: elementRef;  
         
        let offsetX = 0;
        let i = 0;
        for (i = 0; i < this.elementPositions.length; i++) {
            if (this.elementPositions[i].nativeElement.id !== elementRef.nativeElement.id) {
                offsetX += $(this.elementPositions[i].nativeElement).width();
            } else {
                break;
            }
        }    
        
        console.log('offsetX:' + offsetX);
        if (i === 0) {
            this.leftNavButton.attr('href', '#' + this.elementPositions[1].nativeElement.id);
        } else if (i === this.elementPositions.length - 1) {
            offsetX -= this.rightNavButton.outerWidth();
            this.rightNavButton.attr('href', '#' + this.elementPositions[i - 1].nativeElement.id);
        } else {
            this.leftNavButton.attr('href', '#' + this.elementPositions[i - 1].nativeElement.id);
            this.rightNavButton.attr('href', '#' + this.elementPositions[i + 1].nativeElement.id);
        }
        
         TweenMax.to(this.appElement.nativeElement, this.transitionPeriod, {
             'margin-left': offsetX *  -1,
             ease: this.transitionType
         })
    }
}