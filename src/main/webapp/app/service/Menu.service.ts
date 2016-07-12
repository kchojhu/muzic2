import { Injectable, EventEmitter} from '@angular/core';
import { Http, Response} from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {Playlist} from '../model/Models';

@Injectable()
export class MenuService {

    private cacheMap = {};
    constructor(private _http: Http) { }

    getMenu(): Observable<any> {

        return this._http.get('/chart/firebase?dataRef=menu').map((response: Response) => {
            return response.json();
        });
    }

    getPlaylist(country:string) : Observable<Array<Playlist>>  {
        return this._http.get('/chart/firebase?dataRef=playlist/' + country + '/playlist').map((response: Response) => {
            console.log('byte', response.totalBytes);
            let playlists = response.json();
            let playlistsArray:Array<Playlist> = new Array<Playlist>();
            _.each(_.keys(playlists), (playlistKey: string) => {
                let playlist: Playlist = playlists[playlistKey];
                playlistsArray.push(playlist);
            });
            return playlistsArray;
        });
    }


}