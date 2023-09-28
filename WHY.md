# Why put the favicon pictures in the root directory?

When generating a favicon with `astro-favicons`, the instructions ask you to place all files at the root of your web site. You may want to place them in a sub-directory, for example in `http://example.com/assets/favicons/`, just to make things clearer. However, there are three drawbacks with this approach:

- Internet Explorer looks for favicon.ico at the root of the web site. Granted: this is because we ask you to not declare favicon.ico.
- IOS devices look for files such as apple-touch-icon-144x144.png at the root of the web site, as described by Apple. This issue can be mitigated by declaring the icons in the HTML code (this is necessary for Android anyway), but following Apple conventions is probably the best move.
- By default, Internet Explorer 11 looks for browserconfig.xml at the root of the web site.
- Several services, such as Yandex, look for favicon.ico in the root directory.
