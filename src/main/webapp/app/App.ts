///<reference path="../../../../node_modules/angular2/typings/browser.d.ts"/>

import { bootstrap } from 'angular2/platform/browser';
import { Component, AfterViewInit, ViewChild } from 'angular2/core';

import { bootstrap } from 'angular2/platform/browser';
import { Component } from 'angular2/core';


@Component({
    selector: 'app',
    template: `
    <div id="app">
        <div id="left2">Left 2</div>
        <div id="left1">
            <div id="left1A">Left 1A</div>
            <div id="left1B">Left 1B</div>
        </div>
        <div id="main">Main</div>
        <div id="right1">Right 10</div>
    </div>
  `
})
export class App {
    
    constructor() {
        console.log('created App');
    }

}

bootstrap(App, []).catch(err => console.error(err));
