import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from 'angular2/core';
import { Transition } from '../service/Transition.service';

declare var YT: any;
declare var $: any;

@Component({
    selector: '[youtubeContainer]',
    template: `
    <div>
    <a class="navButton leftNav" href="#youtubeContainerLeft" (click)="transitionTo('left')">&#xf039;</a>
    <a class="navButton rightNav" href="#youtubeContainerRight" (click)="transitionTo('right')">&#xf0cb;</a>
    <div id="player"></div>
    </div>
  `
})
export class YoutubeContainer implements AfterViewInit {
    @Output() transitionEventEmitter: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

    private player: any;
    private playerEl: any;

    constructor(private element: ElementRef, private transition: Transition) {
        element.nativeElement.currentMode = 'self';
        console.log('created Youtube Container');
    }

    transitionTo(direction:String) {
        console.log('transition event');
        this.element.nativeElement.direction = direction;
        this.transitionEventEmitter.emit(this.element);
    }

    focus() {
        this.transition.focusComponent(this.element);
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {

        }
        if (event.data === YT.PlayerState.ENDED) {
            //       this.playNext();
        }
        if (event.data === YT.PlayerState.PAUSED) {
        }
    }
    resizeWindow() {
        let pHeight, pWidth;
        let width = $(window).width();
        let height = $(window).height();
        let ratio = 16 / 9;

        if (width / ratio < height) {
            pWidth = Math.ceil(height * ratio);
            return this.playerEl.width(pWidth).height(height).css({
                left: (width - pWidth) / 2,
                top: 0
            });
        } else {
            pHeight = Math.ceil(width / ratio);
            return this.playerEl.width(width).height(pHeight).css({
                left: 0,
                top: (height - pHeight) / 2
            });
        }

    }

    ngAfterViewInit() {
        this.focus();
        this.player = new YT.Player('player', {
            width: 100,
            height: 100,
            videoId: 'QDiJU9GZrnA',
            playerVars: {
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                disablekb: 1,
                cc_load_policy: 0,
                iv_load_policy: 3,
                origin: "http://www.fn1.co/",
                playsinline: 1,
                fs: 1,
                rel: 0,
                wmode: "transparent"
            },
            events: {
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
        this.playerEl = $("#player");
        $(window).on('resize', () => this.resizeWindow());
        this.resizeWindow();

    }

}