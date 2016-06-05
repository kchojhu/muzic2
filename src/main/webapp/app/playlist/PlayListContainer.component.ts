import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { Transition } from '../service/Transition.service';

@Component({
    selector: '[playListContainer]',
    template: `
        <a href="#left" (click)="transitionTo()">Left</a>
  `
})
export class PlayListContainer implements AfterViewInit{
   @Output() transitionEventEmitter:EventEmitter<ElementRef> = new EventEmitter<ElementRef>(); 
    
    constructor(private element:ElementRef, private transition:Transition ) {
        console.log('created PlayList Container');
    }
    
    transitionTo() {
        console.log('transition event');
        this.transitionEventEmitter.emit(this.element);
    }
    
    focus() {
        this.transition.focusComponent(this.element);
    }
    
    ngAfterViewInit() {
          this.focus();
    }

}