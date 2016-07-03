import { Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import { Song, MusicItem, MusicRequest, PlaylistItem  } from "../model/Models";

@Injectable()
export class PlaylistService {
    constructor(private _http: Http) { }

    getSongs(musicRequest: MusicRequest) {

    }
    
    getGenre() {
        return this._http.get('/chart/musicDropdown').map((response: Response) => {
            return <MusicItem[]> response.json();
        });
    }
    
    getPlayList(playlistType:string) {
        return this._http.get('/chart/playlist/' + playlistType).map((response: Response) => {
            return <PlaylistItem[]> response.json();
        });
    }

    
}