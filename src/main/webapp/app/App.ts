///<reference path="../../../../node_modules/angular2/typings/browser.d.ts"/>

import { bootstrap } from 'angular2/platform/browser';
import { Component, AfterViewInit, ViewChild, ElementRef } from 'angular2/core';
import {YoutubeContainer} from './youtube/YoutubeContainer.component';
import {PlayListContainer} from './playlist/PlayListContainer.component';
import { Transition } from './service/Transition.service';


@Component({
    selector: '[app]',
    providers: [Transition],
    directives: [YoutubeContainer, PlayListContainer],
    template: `
        <div id="left2">Left 2</div>
        <div id="left1">
            <div id="left1A">Left 1A</div>
            <div id="left1B">Left 1B</div>
        </div>
        <div id="youtubeContainer" youtubeContainer (transitionEventEmitter)="transitionEvent($event)" ></div>
        <div id="playListContainer" playListContainer (transitionEventEmitter)="transitionEvent($event)"></div>
  `
})
export class App {
    
    private _element: any;
    
    constructor(private _elementRef:ElementRef, private transition:Transition ) {
        this._element = $(_elementRef.nativeElement);
        console.log('created App');
    }

    transitionEvent(elementRef:ElementRef) {
        console.log('ok');
        if (elementRef.nativeElement.id === 'youtubeContainer') {
            TweenMax.to(this._element, 0.6, {'margin-left': '-=200', ease:Power2.easeOut});            
        } else if (elementRef.nativeElement.id === 'playListContainer') {
            TweenMax.to(this._element, 0.6, {'margin-left': '+=200', ease:Power2.easeOut});            
        }

    }

}

bootstrap(App, []).catch(err => console.error(err));
