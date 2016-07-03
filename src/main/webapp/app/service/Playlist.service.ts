import { Injectable, EventEmitter, } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Song, MusicItem, MusicRequest, PlaylistItem  } from "../model/Models";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PlaylistService {
    songsEventEmitter: EventEmitter<string> = new EventEmitter<string>();
    
    constructor(private _http: Http) { }
    
    getSongsEventEmitter():EventEmitter<string> {
        return this.songsEventEmitter;
    }

    getSongs(musicRequest: MusicRequest):Observable<Song[]> {
        
        switch(musicRequest.type) {
            case 'country':
            return this._http.get('/chart/top100?country=' + musicRequest.value).map((response: Response) => {
                return <Song[]>response.json().songs;
            });
            
        }
        

    }
    
    
}