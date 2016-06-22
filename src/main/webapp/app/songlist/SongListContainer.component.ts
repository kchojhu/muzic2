import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { YoutubeService } from '../service/Youtube.service';
import { MusicRequest } from '../model/MusicRequest';
import { MusicItem } from '../model/MusicItem';
import { PlaylistItem } from '../model/Playlist';

@Component({
    selector: '[songListsContainer]',
    template: `
             <fieldset>
                <legend><b>Top 100</b></legend>
                <div class="songitems">
                    <div *ngFor="let country of countriesTop100" class="songitem" (click)="retrievePlayList({type:'country', value:country, name: country})">
                        <div class="songImage" >
                        <img src="/images/flags/flags/48/{{country}}.png">
                        </div> 
                        <span class="caption">{{country}}</span>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend><b>Genre</b></legend>                
                <p *ngFor="let musicItem of genreMusicItems" (click)="retrievePlayList({type:'genre', value:musicItem.value, name: musicItem.name})">{{musicItem.name}}</p>
            </fieldset>
            <fieldset>
                <legend><b>New PlayList</b></legend>
                <p *ngFor="let playlistItem of newPlayListMusicItems" (click)="retrievePlayList({type:'playList', value:playlistItem.id, name:playlistItem.numberOfSongs})">{{playlistItem.numberOfSongs}} {{playlistItem.name}}</p>
            </fieldset>
            <fieldset>
                <legend><b>Fav PlayList</b></legend>
                <p *ngFor="let playlistItem of topFavoritePlayListMusicItems" (click)="retrievePlayList({type:'playList', value:playlistItem.id, name:playlistItem.numberOfSongs})">{{playlistItem.numberOfSongs}} {{playlistItem.name}}</p>
            </fieldset>
            `
})
export class SongListContainer implements AfterViewInit {

    @Output() musicRequestEmitter: EventEmitter<MusicRequest> = new EventEmitter<MusicRequest>();
    private countriesTop100 : string[] = ['Korea', 'America', 'Japan'];
    private genreMusicItems: MusicItem[];
    private newPlayListMusicItems: PlaylistItem[];
    private topFavoritePlayListMusicItems: PlaylistItem[];

    retrievePlayList(musicRequest: MusicRequest) {
        console.log('music requested');
        console.log(musicRequest);
        this.musicRequestEmitter.emit(musicRequest);
    }

    getMusicListings() {
        this.youtubeService.getGenre().subscribe(musicItems => {
            this.genreMusicItems = musicItems;
        }, err => console.log(err));
     }
     
    getPlayListings() {
        this.youtubeService.getPlayList('START_DATE').subscribe(musicItems => {
            this.newPlayListMusicItems = musicItems;
        }, err => console.log(err));

        this.youtubeService.getPlayList('LIKE_CNT').subscribe(musicItems => {
            this.topFavoritePlayListMusicItems = musicItems;
        }, err => console.log(err));
     }

    getElement() : ElementRef{
        return this.element;
    }

    constructor(private element: ElementRef, private youtubeService:YoutubeService) {
        console.log('created PlayList Container');
    }

    transitionTo() {
        console.log('transition event');
//        this.transitionEventEmitter.emit(this.element);
    }
    
    resizeWindow() {
        this.element.nativeElement.style.setProperty('height', $(window).height() + 'px');
    }

    ngAfterViewInit() {
        $(window).on('resize', () => this.resizeWindow());
        this.getMusicListings();
        this.getPlayListings();
        this.resizeWindow();
    }

}