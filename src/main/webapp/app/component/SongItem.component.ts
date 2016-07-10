import { Component, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import {StorageService, MenuService, ApplicationService} from '../service/Services';
import { Country, AppEvent}  from '../model/Models';

@Component({
    moduleId: module.id,
    selector: '[mz-songItem]',
    template: 'ok '
})
export class SongItemComponent {

    test:string = 'hhhhhhhhh';

    constructor(private _elementRef: ElementRef) {
        // debugger;
        // this.test = this._elementRef.nativeElement.getAttribute('data-blah');
    }


}