import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { YoutubeService } from '../service/Youtube.service';
import { MusicRequest } from '../model/MusicRequest';
import { Song } from '../model/Song';

@Component({
    selector: '[playListContainer]',
    template: `
    <div class="music-listing" (window:resize)="onResize($event)" [style.height.px]="height">
        <h1>{{playListName}}</h1>
        <ol>
            <li *ngFor="#song of songs" [ngClass]="{'music-item':true, selected: song.isSelected}" (click)="selectSong(song)">
                <img src="{{song.image}}" class="thumb"><p class="title">{{song.songName}}<small class="author"><br>{{song.artistName}}</small></p>
            </li>
        </ol>
    </div>
  `
})
export class PlayListContainer implements AfterViewInit {
    @Output() youtubePlayerSongEvent: EventEmitter<Song> = new EventEmitter<Song>();
    private height: number = $(window).height();
    private songs: Song[];
    private playListName: string = '';
    private repeatSong: boolean = false;

    onResize(event?) {
        console.log('change height');
        this.height = $(window).height();
        // i hate this...
        let leftNavButton: JQuery = $('#leftNavButton');
        let musicListing = $('.music-listing')[0];
        musicListing.style.width = ($(window).width() - leftNavButton.outerWidth()) + 'px';
    }

    ngAfterViewInit() {
        this.onResize();
    }
    setRandom() {
        if (!this.songs) return;

        this.songs.sort(() => {
            return Math.random() - 0.5;
        })
    }
    
    toggleRepeat() {
        this.repeatSong = !this.repeatSong;
    }
    
    playNextSong(increment: number) {
        if (!this.songs) return;
        let nextSongIndex = this.songs.findIndex((song) => {
            if (song.isSelected) {
                return true;
            }
            return false;
        });


        if (!this.repeatSong) {
            if (nextSongIndex !== undefined && nextSongIndex < this.songs.length - 1) {
                nextSongIndex += increment;
            } else {
                nextSongIndex = 0;
            }
        }

        this.selectSong(this.songs[nextSongIndex]);

    }

    selectSong(selectedSong: Song) {
        this.songs.forEach((song) => {
            if (song.isSelected) {
                song.isSelected = false;
            }

        });

        selectedSong.isSelected = true;
        this.youtubePlayerSongEvent.next(selectedSong);

    }

    retrievePlayList(musicRequest: MusicRequest) {
        console.log('playlist:');
        console.log(musicRequest);
        this.onResize();
        this.youtubeService.getSongs(musicRequest).subscribe(songs => {
            console.log('music loaded');
            console.log(songs);
            this.songs = songs;
            this.playListName = musicRequest.name;
            location.hash = this.element.nativeElement.id;
        }, err => console.log(err));

    }

    constructor(private element: ElementRef, private youtubeService: YoutubeService) {
        console.log('created PlayList Container');
    }

    getElement(): ElementRef {
        return this.element;
    }

}