import { Component, AfterViewInit, OnInit, AfterViewChecked } from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import { MenuService, StorageService, ApplicationService, PlaylistService} from '../service/Services'
import { Country, Playlist, AppEvent} from '../model/Models';
import {ApplicationUtil} from '../app.util';
@Component({
    moduleId: module.id,
    selector: '[mz-menu]',
    templateUrl: 'Menu.component.html',
})
export class MenuComponent implements AfterViewInit, OnInit, AfterViewChecked {
    countries: Array<Country> = new Array<Country>();
    playlists: Array<Playlist> = new Array<Playlist>();
    private _countriesMenu: JQuery;
    private _countriesUpdated: boolean = false;
    private _playListUpdated: boolean = false;
    private _menuApi: any;
    private initializeMenu: boolean = false;
    constructor(private _menuService: MenuService, private _storageService: StorageService, private _applicationService: ApplicationService, private _playlistService: PlaylistService) {

    }

    setSelectedCountries(country: Country, value: boolean) {
        if (value) {
            this._storageService.addCountry(country.countryCode);
            country.checked = true;
        } else {
            this._storageService.removeCountry(country.countryCode);
            country.checked = false;
        }
        this._playListUpdated = true;
    }

    showPlayListSongs(playlistRef: string, event: Event) {
        let playlistElement: JQuery = $($(event.target).attr('data-target'));
        let playlistItems: string = '';
        if (playlistElement.find("span:contains('Loading...')").length > 0) {

            this._playlistService.getSongsByDataRef(playlistRef).subscribe(songs => {
                songs.forEach(song => {
                    playlistItems += "<li><a href='#" + playlistRef + "/" + ApplicationUtil.hash(song.songName + song.artistName) + "'>" + song.songName + '</a></li>\n';
                });

                playlistElement.find('li').replaceWith(playlistItems);
                this.initPlaylistMenu();
            });
        }

    }

    initPlaylistMenu() {
        setTimeout(() => {
            let loadingPlayListElement: JQuery = $("#menu").find("span:contains('Loading...')");
            if ($(loadingPlayListElement[1]).closest('div.mm-panel').length > 0) {
                let playListMenu = $(loadingPlayListElement[1]).closest('div.mm-panel');
                if (playListMenu.length > 0) {
                    this._menuApi.init(playListMenu);
                }
            }
        });
    }

    ngAfterViewChecked() {
        if (this._countriesUpdated) {
            this._menuApi = this._menuApi ? this._menuApi : $("#menu").data("mmenu");
            this._countriesMenu = this._countriesMenu ? this._countriesMenu : $($("#menu").find("span:contains('Country')").siblings().attr('data-target'));
            this._menuApi.init(this._countriesMenu);
            this._countriesUpdated = false;
            this.initPlaylistMenu();
        }

        if (this._playListUpdated) {
            this._menuApi = this._menuApi ? this._menuApi : $("#menu").data("mmenu");
            this._menuApi.init($('#mm-1'));
            this._playListUpdated = false;
            this.initPlaylistMenu();
        }

    }

    private waitUntilElementExists(querySelector: string, callback: Function) {
        let checkExist = setInterval(() => {
            if ($(querySelector).length) {
                callback();
                clearInterval(checkExist);
            }
        }, 100);
    }

    activatePlayList(appEvent: AppEvent) {
        this._menuApi = this._menuApi ? this._menuApi : $("#menu").data("mmenu");
        this._menuApi.open();
        let timeoutWait = 400;
        setTimeout(() => {
            let panel = $($('#menu-country').find('a').attr('data-target'));
            this._menuApi.openPanel(panel);
            setTimeout(() => {
                this.countries.find((country) => {
                    return country.countryCode === appEvent.data.country;
                }).checked = true;
                setTimeout(() => {
                     let playlistPanel = $($('#playlist-' + appEvent.data.country + "-" + appEvent.data.playlist).find('a').attr('data-target'));
                     this._menuApi.openPanel(playlistPanel);
                     let playlistSongsSelector = '#playlist-' + appEvent.data.country + '-' + appEvent.data.playlist;
                    $(playlistSongsSelector + ' a')[0].click();

                    let checkExist = setInterval(() => {
                        if ($($(playlistSongsSelector).find('a').attr('data-target')).find('li>a').length) {
                            $($(playlistSongsSelector).find('a').attr('data-target')).find('li>a')[0].click();
                            clearInterval(checkExist);
                        }
                    }, 100);
                }, timeoutWait);
            }, timeoutWait);
        }, timeoutWait);
    }

    ngOnInit() {
        this._applicationService.applicationEventEmitter.subscribe((event: AppEvent) => {
            if (event.type === 'playlist') {
                this.activatePlayList(event);
            }
        });
        let selectedCountries = this._storageService.getSelectedCountries();
        this._menuService.getMenu().subscribe(menu => {
            _.each(_.keys(menu.countries), (countryKey: string) => {
                let country: Country = menu.countries[countryKey];
                if (_.contains(selectedCountries, country.countryCode)) {
                    country.checked = true;
                } else {
                    country.checked = false;
                }

                this._menuService.getPlaylist(country.countryCode).subscribe(playlists => {
                    country.playlists = playlists;
                });

                this.countries.push(country);


            });
            this._countriesUpdated = true;
            this._playListUpdated = true;
        });

    }

    ngAfterViewInit() {
        $('nav#menu').mmenu({
            extensions: ['effect-slide-menu', 'pageshadow'],
            onClick: {
                close: true,
                preventDefault: false,
                setSelected: true
            },
            navbar: {
                title: 'FN1 Muzic'
            }
        });

        if (!this.initializeMenu) {
            this.initializeMenu = true;
            for (let i = 0; i < 5; i++) {
                setTimeout(this.initPlaylistMenu(), 1000);
            }


        }




    }


}