import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import { PlaylistService, LoadMaskService, MenuService, StorageService, ApplicationService} from './service/Services';
import { MusicPlayerComponent, MenuComponent} from './component/Components';

@Component({
    moduleId: module.id,
    selector: '[mz-app]',
    templateUrl: 'app.component.html',
    directives: [MusicPlayerComponent, MenuComponent],
    providers: [HTTP_PROVIDERS, PlaylistService, LoadMaskService, MenuService, StorageService, ApplicationService]
})
export class AppComponent implements AfterViewInit {

    @ViewChild(MusicPlayerComponent) private _musicPlayerComponent: MusicPlayerComponent;

    constructor(private _loadMaskService: LoadMaskService, private _storageService: StorageService, private _applicationService: ApplicationService) {

    }

    ngAfterViewInit() {
        this._loadMaskService.hideMask();
        // #music-player/playlist/us/top/0
        let hash = location.hash.slice(1);
        let hashValues = hash.split("/");
        if (hashValues[0] ==='admin') {
            Lockr.set('admin', true);
        }
        // if (hashValues && hashValues.length >0 && hashValues[0] ==='music-player') {
        //     // this.focusComponent(this.getAppElement(hash));
        //     this._applicationService.applicationEventEmitter.emit({ type: 'playlist', action : 'openPlaylist', data: { country: hashValues[2], playlist: hashValues[3], songIndex: hashValues[4]} });
        // }


    }
}