import { Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import 'rxjs/Rx';
//import { Observable } from 'rxjs/Rx';
import { Song } from "../model/Song";
import { MusicItem } from "../model/MusicItem";
//import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApplicationUtil } from '../service/ApplicationUtil.service';

//test123
@Injectable()
export class YoutubeService {
    constructor(private _http:Http, private applicationUtil: ApplicationUtil) {}
    
    getSongs(musicItem:MusicItem) {
        this.applicationUtil.showLoad();
        return this._http.get('/chart/top100?country=' + musicItem.value).map((response: Response) => {
            this.applicationUtil.hideLoad();
            return <Song[]> response.json().songs;
        });
    }

//    getDropdown() {
//        return this._http.get('/chart/musicDropdown').map((response: Response) => {
//            return <MusicItem[]> response.json();
//        });
//    }
    
}