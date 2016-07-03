import { Injectable, EventEmitter} from '@angular/core';
import { Http, Response} from '@angular/http';
import { Song, MusicItem, MusicRequest, PlaylistItem  } from "../model/Models";

@Injectable()
export class LoadMaskService {
    private _loadScreenJQuery: JQuery;

    constructor() {
    }

    generateLoadScreenHtml() {
        $("body").append(`
        <div id="loaderScreen">
            <div id="loader" class="loader">
            <div class="side"> </div>
            <div class="side"> </div>
            <div class="side"> </div>
            <div class="side"> </div>
            <div class="side"> </div>
            <div class="side"> </div>
            <div class="side"> </div>
            <div class="side"> </div>
            </div>
        </div>`);
        return $('#loaderScreen');
    }

    hideMask() {
        this._loadScreenJQuery = this._loadScreenJQuery ? this._loadScreenJQuery : this.generateLoadScreenHtml(); 
        this._loadScreenJQuery.css('visibility', 'hidden');
    }

    showMask() {
        this._loadScreenJQuery = this._loadScreenJQuery ? this._loadScreenJQuery : this.generateLoadScreenHtml();
        this._loadScreenJQuery.css('visibility', 'visible');
    }

}