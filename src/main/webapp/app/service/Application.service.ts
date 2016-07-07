import { Injectable, EventEmitter} from '@angular/core';
import {AppEvent} from '../model/Models';

@Injectable()
export class ApplicationService {

    applicationEventEmitter: EventEmitter<AppEvent> = new EventEmitter<AppEvent>();

    constructor() { }

    emitEvent(event:AppEvent) {
        this.applicationEventEmitter.next(event);
    }

}