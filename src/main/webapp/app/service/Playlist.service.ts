import { Injectable, EventEmitter} from '@angular/core';
import { Http, Response} from '@angular/http';
import { Song, MusicItem, MusicRequest, Playlist  } from "../model/Models";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class PlaylistService {
    songsEventEmitter: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _http: Http) { }

    getSongsEventEmitter(): EventEmitter<string> {
        return this.songsEventEmitter;
    }

    getSongsByDataRef(dataRef: string): Observable<Song[]> {
        return this._http.get('/chart/playlist-songs?dataRef=playlist/' + dataRef).map((response: Response) => {
            // let songs:Array<Song> = new Array<Song>();
            // let responseJson = response.json(); 
            // _.each(_.keys(responseJson), (songKey) => {
            //      songs.push(responseJson[songKey]);
            // });

            // return songs;
            return <Song[]>response.json();
        });
    }

    getSongs(musicRequest: MusicRequest): Observable<Song[]> {

        switch (musicRequest.type) {
            case 'country':
                return this._http.get('/chart/top100?country=' + musicRequest.value).map((response: Response) => {
                    return <Song[]>response.json().songs;
                });

        }


    }


}