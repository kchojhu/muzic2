import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import { PlaylistService, LoadMaskService} from './service/Services';
import { MusicPlayerComponent} from './component/Components';

@Component({
    moduleId: module.id,
    selector: '[mz-app]',
    templateUrl: 'app.component.html',
    directives: [MusicPlayerComponent],
    providers: [HTTP_PROVIDERS, PlaylistService, LoadMaskService]
})
export class AppComponent implements AfterViewInit {

    constructor(private _loadMaskService: LoadMaskService) {

    }

    ngAfterViewInit() {
        this._loadMaskService.hideMask();
        $('nav#menu').mmenu({
            extensions: ['effect-slide-menu', 'pageshadow'],
            searchfield: true,
            counters: true,
            navbar: {
                title: 'Advanced menu'
            },
            navbars: [
                {
                    position: 'top',
                    content: ['searchfield']
                }, {
                    position: 'top',
                    content: [
                        'prev',
                        'title',
                        'close'
                    ]
                }, {
                    position: 'bottom',
                    content: [
                        '<a href="http://mmenu.frebsite.nl/wordpress-plugin.html" target="_blank">WordPress plugin</a>'
                    ]
                }
            ]
        });
    }
}