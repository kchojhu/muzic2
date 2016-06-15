import { Component, AfterViewInit, ElementRef, Output, EventEmitter} from '@angular/core';
import { Transition } from '../service/Transition.service';
import { MusicRequest } from '../model/MusicRequest';

@Component({
    selector: '[songListsContainer]',
    template: `
             <fieldset>
                <legend><b>Top 100</b></legend>
                <div class="songitems">
                    <div *ngFor="let country of countriesTop100" class="songitem" (click)="retrievePlayList({type:'country', value:country})">
                        <div class="songImage" >
                        <img src="/images/flags/flags/48/{{country}}.png">
                        </div> 
                        <span class="caption">{{country}}</span>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend><b>Genre</b></legend>
                <p>test</p>
                <p>test</p>
                <p>test</p>
            </fieldset>
            <fieldset>
                <legend><b>Album</b></legend>
                <p>test</p>
                <p>test</p>
                <p>test</p>
            </fieldset>
            `
})
export class SongListContainer implements AfterViewInit {

    @Output() musicRequestEmitter: EventEmitter<MusicRequest> = new EventEmitter<MusicRequest>();
    private countriesTop100 : string[] = ['Korea', 'America', 'Japan'];

    retrievePlayList(musicRequest: MusicRequest) {
        console.log('music requested');
        console.log(musicRequest);
        this.musicRequestEmitter.emit(musicRequest);
    }

    getElement() : ElementRef{
        return this.element;
    }

    constructor(private element: ElementRef, private transition: Transition) {
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
        this.resizeWindow();
    }

}