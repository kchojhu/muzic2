import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { Transition } from '../service/Transition.service';
import { YoutubeService} from '../service/Youtube.service';

declare var YT: any;
declare var $: any;
declare var _: any;

@Component({
    selector: '[youtubeContainer]',
    template: `
    <div>
    <a class="navButton" href="#songListsContainer" (click)="transitionTo($event)">&#xf039;</a>
    <a class="navButton rightNav" href="#playListContainer" (click)="transitionTo($event)">&#xf0cb;</a>
    <div id="playerContainer">
        <div id="player"></div>
    </div>
    </div>
  `
})
export class YoutubeContainer implements AfterViewInit {
    @Output() transitionEventEmitter: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

    private player: any;
    private playerEl: any;

    getElement(): ElementRef {
        return this.element;
    }

    constructor(private element: ElementRef, private transition: Transition, private youtubeService: YoutubeService) {
        element.nativeElement.currentMode = 'self';
        console.log('created Youtube Container');
    }

    transitionTo(event: any) {
        console.log('transition event');

        if (!event.srcElement.origHash) {
            event.srcElement.origHash = event.srcElement.hash;
        } else {
            event.srcElement.hash = ('#' + this.element.nativeElement.id === event.srcElement.hash ? event.srcElement.origHash : '#' + this.element.nativeElement.id);
        }

    }


    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            console.log('playing');


        }
        if (event.data === YT.PlayerState.ENDED) {
            //       this.playNext();
        }
        if (event.data === YT.PlayerState.PAUSED) {
        }
    }
    resizeWindow() {
        // if (location.hash !== '#' + this.element.nativeElement.id) {
        //     return;
        // }
        console.log('resize');
        let width = $(window).width();        
        let pHeight, pWidth;
        let height = $(window).height();
        let ratio: number = 16 / 9;
        if (width / ratio < height) {
            pWidth = Math.ceil(height * ratio);
            console.log('pWidth:' +  pWidth)
            this.playerEl.width(pWidth).height(height).css({
                left: (width - pWidth) / 2,
                top: 0
            });
        } else {
            pHeight = Math.ceil(width / ratio);
            this.playerEl.width(width).height(pHeight).css({
                left: 0,
                top: (height - pHeight) / 2
            });
        }
        this.element.nativeElement.style.setProperty('width', width + 'px');
        

    }

    ngAfterViewInit() {
        this.youtubeService.getSongs({ name: 'Korean', value: 'Korean' }).subscribe(songs => {
            console.log('music loaded');
            //         let songIndex = 0;
            //         _.each(songs, (song) => song.songIndex = songIndex++);
            //         this.songs = songs;
            //            
            //         this.currentSong = songs[0];
            //         this.currentSong.isSelected = true;  
        }, err => console.log(err));
        let width = $(window).width();
        let ratio: number = 16 / 9;
        this.player = new YT.Player('player', {
            width: width,
            height: Math.ceil(width / ratio), 
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