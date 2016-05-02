import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from 'angular2/core';
import { Transition } from '../service/Transition.service';

@Component({
    selector: '[youtubeContainer]',
    template: `
        <a href="#right" (click)="transitionTo()">Right</a>
  `
})
export class YoutubeContainer implements AfterViewInit{
    @Output() transitionEventEmitter:EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
    
    constructor(private element:ElementRef, private transition:Transition ) {
        console.log('created Youtube Container');
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