import { Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import 'rxjs/Rx';
//import { Observable } from 'rxjs/Rx';
import { Song } from "../model/Song";
import { MusicItem } from "../model/MusicItem";
//import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MusicRequest } from '../model/MusicRequest';
import { PlaylistItem } from '../model/Playlist';

import { ApplicationUtil } from '../service/ApplicationUtil.service';

//test123
@Injectable()
export class YoutubeService {
    constructor(private _http: Http, private applicationUtil: ApplicationUtil) { }
    
    // getSongs(musicItem:MusicItem) {
    //     this.applicationUtil.showLoad();
    //     return this._http.get('/chart/top100?country=' + musicItem.value).map((response: Response) => {
    //         this.applicationUtil.hideLoad();
    //         return <Song[]> response.json().songs;
    //     });
    // }

    getSongs(musicRequest: MusicRequest) {
        this.applicationUtil.showLoad();
        if (musicRequest.type === 'country') {
            return this._http.get('/chart/top100?country=' + musicRequest.value).map((response: Response) => {
                this.applicationUtil.hideLoad();
                return <Song[]>response.json().songs;
            });
        }

        if (musicRequest.type === 'genre') {
            return this._http.get('/chart/genre/' + musicRequest.value).map((response: Response) => {
                this.applicationUtil.hideLoad();
                return <Song[]>response.json().songs;
            });
        }
        
        if (musicRequest.type === 'playList') {
            return this._http.get('/chart/playlist-songs/' + musicRequest.value).map((response: Response) => {
                this.applicationUtil.hideLoad();
                return <Song[]>response.json().songs;
            });
        }

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

    //    getDropdown() {
    //        return this._http.get('/chart/musicDropdown').map((response: Response) => {
    //            return <MusicItem[]> response.json();
    //        });
    //    }
    
}