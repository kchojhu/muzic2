import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { Transition } from '../service/Transition.service';
import { YoutubeService} from '../service/Youtube.service';
import { Song} from '../model/Song';


declare var YT: any;
declare var $: any;
declare var _: any;

declare var classie;
@Component({
    selector: '[youtubeContainer]',
    template: `
    <div>
    <a id="leftNavButton" class="navButton" href="#songListsContainer" (click)="transitionTo($event)">&#xf039;</a>
    <a id="rightNavButton" class="navButton rightNav" href="#playListContainer" (click)="transitionTo($event)">&#xf0cb;</a>
    </div>
    <div id="playerContainer">
        <div id="playListMenu">
            <div class="component csstransforms">
                <button class="cn-button" id="cn-button">Menu</button>
                <div class="cn-wrapper" id="cn-wrapper">
                    <ul>
                        <li><a href="#"><span>&#xf1f8;</span></a></li>
                        <li (click)="playListEvent('repeat')"><a href="#" [style.color]="toggleRepeatColor"><span>&#xf01e;</span></a></li>
                        <li (click)="playListEvent('prev')"><a href="#" ><span>&#xf04a;</span></a></li>
                        <li (click)="playPauseButton($event)"><a href="#" ><span [innerHTML]="playPauseString"></span></a></li>
                        <li (click)="playListEvent('next')"><a href="#"><span>&#xf04e;</span></a></li>
                        <li (click)="playListEvent('random')"><a href="#"><span>&#xf074;</span></a></li>
                        <li><a href="#"><span>&#xf129;</span></a></li>
                    </ul>
                </div>
         </div>
        <div id="player"></div>
    </div>
    </div>
  `
})
export class YoutubeContainer implements AfterViewInit {
    @Output() playListEventEmitter: EventEmitter<string> = new EventEmitter<string>();

    private playPauseString: string = '&#xf04b;';
    private player: any;
    private playerEl: any;
    private playerMenuEl: any;
    private playerMenuButton: JQuery;
    private playerMenuButtonWrapper: JQuery;
    private currentSong: Song;
    private currentMode: any;
    private toggleRepeatColor:string = 'white';

    playListEvent(command:string) {
        if (command === 'repeat') {
            this.toggleRepeatColor = this.toggleRepeatColor === 'white' ? '#429a67' : 'white';
        }
        this.playListEventEmitter.next(command);
    }

    playPauseButton(event:Event) {
        if (this.currentMode === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }

    getElement(): ElementRef {
        return this.element;
    }

    constructor(private element: ElementRef, private transition: Transition, private youtubeService: YoutubeService) {
        element.nativeElement.currentMode = 'self';
        console.log('created Youtube Container');
    }

    transitionTo(event: any) {
        // console.log('transition event');

        // if (!event.srcElement.origHash) {
        //     event.srcElement.origHash = event.srcElement.hash;
        // } else {
        //     event.srcElement.hash = ('#' + this.element.nativeElement.id === event.srcElement.hash ? event.srcElement.origHash : '#' + this.element.nativeElement.id);
        // }

    }

    play(song?: Song) {
        console.log('play:' + JSON.stringify(song));
        

        if (song) {
            this.player.loadVideoById(song.songId);
            this.currentSong = song;
            return;
        }

    }

    onPlayerError(event) {
        this.playListEvent('next');
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            console.log('playing');
            this.currentMode = YT.PlayerState.PLAYING;
            this.playPauseString = '&#xf04c;';
            this.playerEl[0].style.zIndex=1;
        }
        if (event.data === YT.PlayerState.ENDED) {
            this.playListEventEmitter.next('next');
        }
        if (event.data === YT.PlayerState.PAUSED) {
            this.currentMode = YT.PlayerState.PAUSED;
            this.playPauseString = '&#xf04b;'; 

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
            console.log('pWidth:' + pWidth)
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
        
        // this.playerMenuEl.style.width = (width / 2) + 'px';
        // this.playerMenuEl.style.height = (height / 2) + 'px';
    
        this.playerMenuEl.style.width = width + 'px';
        this.playerMenuEl.style.height = height + 'px';


        this.element.nativeElement.style.setProperty('width', width + 'px');


    }

    ngAfterViewInit() {
        // this.youtubeService.getSongs({ name: 'Korean', value: 'Korean' }).subscribe(songs => {
        //     console.log('music loaded');
        // }, err => console.log(err));
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
                'onStateChange': this.onPlayerStateChange.bind(this),
                'onError': this.onPlayerError.bind(this)
            }
        });
        this.playerEl = $("#player");
        this.playerMenuEl = $('#playListMenu .component')[0];
        $(window).on('resize', () => this.resizeWindow());
        this.resizeWindow();

        this.playerMenuButton = $('#cn-button');
        this.playerMenuButtonWrapper = $('#cn-wrapper');

        this.playerMenuButton.on('click', (event:Event) => {
            event.stopPropagation();
            this.togglePlayMenu();
        });
        $('#playListMenu .component').on('click', (event:Event) => {
            console.log('hello');
            event.stopPropagation();
            this.togglePlayMenu()}
        );

    }

    togglePlayMenu() {
        if (this.playerMenuButton.html() !== "Close") {            
            this.playerMenuButton.html("Close");
            this.playerMenuButtonWrapper.addClass('opened-nav');
        }
        else {
            this.playerMenuButton.html("Menu");
            this.playerMenuButtonWrapper.removeClass('opened-nav');
        }
    }

}