System.register(['angular2/platform/browser'], function(exports_1) {
    var browser_1;
    var debugElement, MyDirective;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            }],
        execute: function() {
            MyDirective = (function () {
                function MyDirective() {
                }
                return MyDirective;
            })();
            // #docregion by_all
            debugElement.query(browser_1.By.all());
            // #enddocregion
            // #docregion by_css
            debugElement.query(browser_1.By.css('[attribute]'));
            // #enddocregion
            // #docregion by_directive
            debugElement.query(browser_1.By.directive(MyDirective));
        }
    }
});
// #enddocregion
//# sourceMappingURL=by.js.map