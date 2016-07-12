import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import {StorageService, MenuService, ApplicationService} from '../service/Services';
import { Country, AppEvent}  from '../model/Models';

@Component({
    moduleId: module.id,
    selector: '[mz-musicplayer]',
    templateUrl: 'MusicPlayer.component.html',
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {
    private player: any;
    private playerEl: JQuery;
    private currentSong: any;
    private _isNewUser: boolean = false;
    private playerMenuButton: JQuery;
    private playPauseString: string = '&#xf04b;';
    private playerMenuButtonWrapper: JQuery;
    private currentMode: any;
    private _isPlayeReady: boolean = false;
    private countries: Array<Country> = new Array<Country>();
    private progressBar: JQuery;
    private progressBarInterval: any;
    private loopSongMode: boolean = false;
    private randomSongMode: boolean = false;

    constructor(private _storageService: StorageService, private _menuService: MenuService, private _applicationService: ApplicationService) {

    }
    toggleRandomButton() {
        this.randomSongMode = !this.randomSongMode;
        this.loopSongMode = false;
    }
    toggleLoopButton() {
        this.loopSongMode = !this.loopSongMode;
        this.randomSongMode = false;
    }

    playListEvent(command: string) {
        // if (command === 'repeat') {
        //     this.toggleRepeatColor = this.toggleRepeatColor === 'white' ? '#429a67' : 'white';
        // }
        this._applicationService.applicationEventEmitter.emit({ type: "playlist", action: 'playNextSong', data: { command: command } });
    }

    selectCountryMusic(country: Country) {
        this._storageService.addCountry(country.countryCode);
        this._applicationService.applicationEventEmitter.emit({ type: 'playlist', action: 'openPlaylist', data: { country: country.countryCode, playlist: 'top', songIndex: 0 } });
    }

    playerEventProcessor(appEvent) {

        switch (appEvent.action) {
            case 'play':
                this.currentSong = appEvent.data;

                if (!this._isPlayeReady) {
                    this._isPlayeReady = true;
                    console.log('init song:' + this.currentSong.youtubeId);
                    this.initPlayer(this.currentSong.youtubeId);

                } else {
                    console.log('xxx song:' + this.currentSong.youtubeId);
                    this.player.loadVideoById(this.currentSong.youtubeId);
                }
                break;
        }


    }

    ngOnInit() {
        // $(window).on('hashchange', this.hashchange.bind(this));
        this._applicationService.applicationEventEmitter.subscribe(appEvent => {
            if (appEvent.type === 'player') {
                console.log('app event', appEvent);
                this.playerEventProcessor(appEvent);
            }
        });
        if (this._storageService.isNewUser) {
            this._isNewUser = true;
            this._menuService.getMenu().subscribe(menu => {
                _.each(_.keys(menu.countries), (country) => {
                    this.countries.push(menu.countries[country]);
                });
            });
        }
    }

    hashchange() {
        let hash = location.hash.slice(1);
        let hashValues = hash.split("/");
        if (hashValues && hashValues.length > 0 && hashValues[0] === 'music-player') {

        }


        if (!this._isPlayeReady) {
            this.initPlayer(hashValues[5]);
            this._isPlayeReady = true;
        }

        // console.log(hashValues);
        // if (hash.indexOf('Container') > 0) {
        //     // this.focusComponent(this.getAppElement(hash));
        // }

    }


    resizeWindow() {
        let width = $(window).width();
        let pHeight, pWidth;
        let height = $(window).height();
        let ratio: number = 16 / 9;
        if (width / ratio < height) {
            pWidth = Math.ceil(height * ratio);
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

        this.progressBar.css('top', height - this.progressBar.height());
        // this.progressBar.css('width', width);


        // this.playerMenuEl.style.width = width + 'px';
        // this.playerMenuEl.style.height = height + 'px';


        // this.element.nativeElement.style.setProperty('width', width + 'px');


    }

    ngAfterViewInit() {
        //  let hash:string = location.hash.slice(1);
        //  if (hash.indexOf("music-player/playlist") > -1) {
        //      let hashArray = hash.split("/");
        //      let country = hashArray[2];
        //      let playlistId = hashArray[3];
        //      let songIndex = hashArray[4];
        //      console.log(country, playlistId, songIndex);
        //  }

        this.progressBar = $('#myProgress');
        this.progressBar.on('click touchend', { thisObject: this }, function (e) {
            console.log('here');
            let newTime = e.data.thisObject.player.getDuration() * ((e.pageX - this.offsetLeft) / $(this).width());
            e.data.thisObject.player.seekTo(newTime);
        });

    }

    onPlayerError(error) {
        console.log(error);
    }

    initPlayer(videoId: string) {
        // this.youtubeService.getSongs({ name: 'Korean', value: 'Korean' }).subscribe(songs => {
        //     console.log('music loaded');
        // }, err => console.log(err));
        // #selectCountryList
        // $()
        let width = $(window).width();
        let ratio: number = 16 / 9;
        this.player = new YT.Player('player', {
            width: width,
            height: Math.ceil(width / ratio),
            videoId: videoId,
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
        // this.playerMenuEl = $('#playListMenu .component')[0];
        $(window).on('resize', () => this.resizeWindow());
        this.resizeWindow();

        this.playerMenuButton = $('#cn-button');
        this.playerMenuButtonWrapper = $('#cn-wrapper');

        this.playerMenuButton.on('click', (event: Event) => {
            event.stopPropagation();
            this.togglePlayMenu();
        });
        $('#playListMenu .component').on('click', (event: Event) => {
            event.stopPropagation();
            this.togglePlayMenu()
        }
        );
        console.log('hello');
    }

    moveProgressBar() {
        let playerTimeDifference = (this.player.getCurrentTime() / this.player.getDuration()) * 100;

        this.progressBar.find('#myBar').css('width', playerTimeDifference + '%');
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            console.log('playing');
            this.currentMode = YT.PlayerState.PLAYING;
            location.hash = this.currentSong.dataRef;
            this.playPauseString = '&#xf04c;';
            this.progressBar.css('visibility', 'hidden');
            if ($('#playListMenu').css('display') !== 'block') {
                $('#playListMenu').css('display', 'block');
                setInterval(() => {
                    this.moveProgressBar();
                }, 100);
            }

        }
        if (event.data === YT.PlayerState.ENDED) {
            if (this.loopSongMode) {
                this.playListEvent('loop');
            } if (this.randomSongMode) {
                this.playListEvent('random');
            } else {
                this.playListEvent('next');
            }
        }
        if (event.data === YT.PlayerState.PAUSED) {
            this.currentMode = YT.PlayerState.PAUSED;
            this.playPauseString = '&#xf04b;';
        }
    }

    togglePlayMenu(mode?: string) {
        if (mode && mode === 'close') {
            this.playerMenuButton.html("Menu");
            this.playerMenuButtonWrapper.removeClass('opened-nav');
            this.progressBar.css('visibility', 'hidden');
            return;
        }

        if (this.playerMenuButton.html() !== "Close") {
            this.playerMenuButton.html("Close");
            this.playerMenuButtonWrapper.addClass('opened-nav');
            this.progressBar.css('visibility', 'visible');
        }
        else {
            this.playerMenuButton.html("Menu");
            this.playerMenuButtonWrapper.removeClass('opened-nav');
            this.progressBar.css('visibility', 'hidden');
        }
    }

    playPauseButton(event: Event) {
        if (this.currentMode === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }
}