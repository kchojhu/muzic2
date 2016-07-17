import { Injectable, EventEmitter} from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions} from '@angular/http';
import { Song, MusicItem, MusicRequest, Playlist  } from "../model/Models";
import { Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()
export class PlaylistService {
    songsEventEmitter: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _http: Http) { }

    getSongsEventEmitter(): EventEmitter<string> {
        return this.songsEventEmitter;
    }

    getSongsByDataRef(dataRef: string): Observable<Song[]> {
        return this._http.get('/chart/playlist-songs?dataRef=' + dataRef).map((response: Response) => {
            // let songs:Array<Song> = new Array<Song>();
            // let responseJson = response.json(); 
            // _.each(_.keys(responseJson), (songKey) => {
            //      songs.push(responseJson[songKey]);
            // });

            // return songs;
            return <Song[]>response.json();
        });
    }

    replaceSong(title: string, artist: string, dataRef: string) {
        var params = new URLSearchParams();
        params.set('title', title);
        params.set('artist', artist);
        params.set('dataRef', dataRef);
        return this._http.get('/chart/replaceSong', new RequestOptions({ search: params })).map((response: Response) => {
            if (response.text().length) {
                
                return <Song>response.json();
            } else {
                throw (new Error("No Song Found"));
            }
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