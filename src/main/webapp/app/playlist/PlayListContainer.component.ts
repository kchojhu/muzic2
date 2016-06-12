import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { Transition } from '../service/Transition.service';

@Component({
    selector: '[playListContainer]',
    template: `
        blah
  `
})
export class PlayListContainer implements AfterViewInit {
    @Output() transitionEventEmitter: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

    constructor(private element: ElementRef, private transition: Transition) {
        console.log('created PlayList Container');
    }

    getElement(): ElementRef {
        return this.element;
    }


    ngAfterViewInit() {

    }

}