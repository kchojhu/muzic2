import { bootstrap } from "@angular/platform-browser-dynamic";
import { Component, ElementRef, ViewChild, } from "@angular/core";

import {YoutubeContainer} from './youtube/YoutubeContainer.component';
import {PlayListContainer} from './playlist/PlayListContainer.component';
import {SongListContainer} from './songlist/SongListContainer.component';
import { Transition } from './service/Transition.service';
import { YoutubeService } from './service/Youtube.service';
import { ApplicationUtil } from './service/ApplicationUtil.service';
import { MusicRequest } from './model/MusicRequest';
import { Song } from './model/Song';
import { HTTP_PROVIDERS} from '@angular/http';
import { } from '@angular/router';

@Component({
    selector: '[app]',
    providers: [Transition, YoutubeService, HTTP_PROVIDERS, ApplicationUtil],
    directives: [SongListContainer, YoutubeContainer, PlayListContainer],
    template: `
        <div id="songListsContainer" songListsContainer (musicRequestEmitter)="retrievePlayList($event)"></div>
        <div id="youtubeContainer" youtubeContainer (playListEventEmitter)="playListEvent($event)"></div>
        <div id="playListContainer" playListContainer (youtubePlayerSongEvent)="youtubePlayerSongEvent($event)"></div>
  `
})
export class App {

    @ViewChild(SongListContainer) songListContainer: SongListContainer;
    @ViewChild(YoutubeContainer) youtubeContainer: YoutubeContainer;
    @ViewChild(PlayListContainer) playListContainer: PlayListContainer;

    retrievePlayList(musicRequest:MusicRequest) {
        this.playListContainer.retrievePlayList(musicRequest);
    }
    
    playListEvent(command:string) {
        switch(command) {
            case 'next':   
                this.playListContainer.playNextSong(1);
                break;
            case 'prev':
                this.playListContainer.playNextSong(-1);
                break;
            case 'random':
                this.playListContainer.setRandom();
                break;            
            case 'repeat':
                this.playListContainer.toggleRepeat();
                break;            
        }
    }
    
    youtubePlayerSongEvent(song:Song) {
        this.youtubeContainer.play(song);
    }

  selectedSongEvent(song: Song) {
        console.log('song emitted:' + JSON.stringify(song));
        this.youtubeContainer.play(song);
       }

    getElement(): ElementRef {
        return this.element;
    }

    constructor(private element: ElementRef, private transition: Transition) {
        //        this._element = $(_elementRef.nativeElement);
    }

    ngAfterViewInit() {
        console.log('created App');
        this.transition.setAppElement(this);
        location.hash = this.songListContainer.getElement().nativeElement.id;
    }

}

bootstrap(App, []).catch(err => console.error(err));
