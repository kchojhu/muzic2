import { bootstrap } from "@angular/platform-browser-dynamic";
import { Component, ElementRef } from "@angular/core";

 import {YoutubeContainer} from './youtube/YoutubeContainer.component';
 import {PlayListContainer} from './playlist/PlayListContainer.component';
 import { Transition } from './service/Transition.service';
 import { YoutubeService } from './service/Youtube.service';
 import { ApplicationUtil } from './service/ApplicationUtil.service';
 import { HTTP_PROVIDERS} from '@angular/http';


@Component({
    selector: '[app]',
    providers: [Transition, YoutubeService, HTTP_PROVIDERS, ApplicationUtil],
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

    constructor(private _elementRef: ElementRef, private transition: Transition) {
        this._element = $(_elementRef.nativeElement);
        console.log('created App');
    }

    transitionEvent(elementRef: ElementRef) {

        if (elementRef.nativeElement.id === 'youtubeContainer') {

            if (elementRef.nativeElement.direction === 'right') {
                if (elementRef.nativeElement.currentMode === 'self') {
                    TweenMax.to(this._element, 0.6, { 'margin-left': '-=200', ease: Power2.easeOut });
                    elementRef.nativeElement.currentMode = 'right';
                } else if (elementRef.nativeElement.currentMode = 'right') {
                    TweenMax.to(this._element, 0.6, { 'margin-left': '+=200', ease: Power2.easeOut });
                    elementRef.nativeElement.currentMode = 'self';
                }
            }

            if (elementRef.nativeElement.direction === 'left') {
                if (elementRef.nativeElement.currentMode === 'self') {
                    TweenMax.to(this._element, 0.6, { 'margin-left': '+=200', ease: Power2.easeOut });
                    elementRef.nativeElement.currentMode = 'left';
                } else if (elementRef.nativeElement.currentMode = 'left') {
                    TweenMax.to(this._element, 0.6, { 'margin-left': '-=200', ease: Power2.easeOut });
                    elementRef.nativeElement.currentMode = 'self';
                }
            }

        }

    }

}

bootstrap(App, []).catch(err => console.error(err));
