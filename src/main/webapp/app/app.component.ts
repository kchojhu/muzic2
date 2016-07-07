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

    @ViewChild(MusicPlayerComponent) private  _musicPlayerComponent: MusicPlayerComponent;

    constructor(private _loadMaskService: LoadMaskService, private _storageService: StorageService) {

    }

    ngAfterViewInit() {
        this._loadMaskService.hideMask();

        // let hash = location.hash.slice(1);
        // if (hash && hash.length > 0) {
        //     this._musicPlayerComponent.hashchange();
        // }

    }
}