import { Component, AfterViewInit } from '@angular/core';
import { OtherComponent } from "./other/other.component";
import { HTTP_PROVIDERS} from '@angular/http';
import {PlaylistService} from './service/Services';

@Component({
    moduleId: module.id,
    selector: '[my-app]',
    templateUrl: 'app.component.html',
    directives: [OtherComponent],
    providers: [HTTP_PROVIDERS, PlaylistService]
})
export class AppComponent implements AfterViewInit {
    ngAfterViewInit() {
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