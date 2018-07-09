var s = document.createElement('script');
browser = chrome || browser;
s.src = browser.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
