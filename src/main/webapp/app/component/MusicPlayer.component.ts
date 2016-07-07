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
    private _isNewUser: boolean = false;
    private countries: Array<Country> = new Array<Country>();

    constructor(private _storageService: StorageService, private _menuService: MenuService, private _applicationService: ApplicationService) {

    }

    selectCountryMusic(country: Country) {
        this._storageService.addCountry(country.countryCode);
        this._applicationService.applicationEventEmitter.emit({ type: 'playlist', data: { country: country.countryCode, playlist: 'top' } });
    }


    ngOnInit() {
        $(window).on('hashchange', this.hashchange.bind(this));
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
        // let hash = location.hash.slice(1);
        // console.log('here');
        // let hashValues = hash.split("/");
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

    }

    ngAfterViewInitBlah() {
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
                // 'onStateChange': this.onPlayerStateChange.bind(this),
                // 'onError': this.onPlayerError.bind(this)
            }
        });
        this.playerEl = $("#player");
        // this.playerMenuEl = $('#playListMenu .component')[0];
        $(window).on('resize', () => this.resizeWindow());
        this.resizeWindow();

        // this.playerMenuButton = $('#cn-button');
        // this.playerMenuButtonWrapper = $('#cn-wrapper');

        // this.playerMenuButton.on('click', (event:Event) => {
        //     event.stopPropagation();
        //     this.togglePlayMenu();
        // });
        // $('#playListMenu .component').on('click', (event:Event) => {
        //     console.log('hello');
        //     event.stopPropagation();
        //     this.togglePlayMenu()}
        // );
    }


}