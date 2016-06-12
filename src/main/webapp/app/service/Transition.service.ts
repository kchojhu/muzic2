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
        console.log('focus');
        console.log(elementRef);
        this.currentElement = this.currentElement ? this.currentElement: elementRef;  
         
        let offsetX = 0;
        for (let i = 0; i < this.elementPositions.length; i++) {
            if (this.elementPositions[i].nativeElement.id !== elementRef.nativeElement.id) {
                offsetX += $(this.elementPositions[i].nativeElement).width();
            } else {
                break;
            }
        }        
        
        // if (elementRef.nativeElement.id === this.app.youtubeContainer.getElement().nativeElement.id) {
        //     this.app.youtubeContainer.resizeWindow();
        // }
        
         
//         let offsetX = elementRef.nativeElement.offsetLeft;
         console.log('offsetX:' + offsetX);
         //              'margin-left': '-=' + offsetY,
         TweenMax.to(this.appElement.nativeElement, this.transitionPeriod, {
             'margin-left': offsetX *  -1,
             ease: this.transitionType
         })
         
//         TweenMax.to(this.appElement)
         
         
         
         
        
        // let element = $(elementRef.nativeElement);
        // if (!width) {
        //     element.width($(window).width());
        // }
    }
}