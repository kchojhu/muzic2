import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { Transition } from '../service/Transition.service';

@Component({
    selector: '[songListsContainer]',
    template: `
             <fieldset>
                <legend><b>Top 100</b></legend>
                <p>test</p>
                <p>test</p>
                <p>test</p>
            </fieldset>
            <fieldset>
                <legend><b>Genre</b></legend>
                <p>test</p>
                <p>test</p>
                <p>test</p>
            </fieldset>
            <fieldset>
                <legend><b>Album</b></legend>
                <p>test</p>
                <p>test</p>
                <p>test</p>
            </fieldset>
            `
})
export class SongListContainer implements AfterViewInit {

    getElement() : ElementRef{
        return this.element;
    }

    constructor(private element: ElementRef, private transition: Transition) {
        console.log('created PlayList Container');
    }

    transitionTo() {
        console.log('transition event');
//        this.transitionEventEmitter.emit(this.element);
    }

    focus() {
        //        this.transition.focusComponent(this.element);
    }

    ngAfterViewInit() {
        this.focus();
    }

}