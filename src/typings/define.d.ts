//loadScript现在改为外部调用，从index.html调用
declare function loadScript(url: string, callback: Function, thisObj?: any, ...args);