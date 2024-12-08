# Why Place Favicons in the Root Directory?

When using `astro-favicons`, it’s recommended to place all favicon-related files in the root directory of your website. While you may prefer organizing them in a subdirectory (e.g., http://example.com/assets/favicons/), doing so comes with several limitations::

1. **Internet Explorer Compatibility**: Internet Explorer expects `favicon.ico` to be located in the root directory. While you aren’t required to explicitly declare `favicon.ico`, placing it at the root ensures compatibility.

2. **iOS Device Behavior**: iOS devices look for files like `apple-touch-icon-144x144.png` in the root directory, following Apple’s guidelines. While this can be addressed by declaring these icons in your HTML (necessary for Android), adhering to Apple’s conventions is generally the best approach.

3. **Browserconfig.xml**: for IE11: By default, Internet Explorer 11 searches for `browserconfig.xml` in the root directory.

4. **Service Compatibility**: Certain services, such as Yandex, specifically look for `favicon.ico` in the root directory.

To ensure smooth compatibility across platforms and services, placing favicon files in the root directory is the simplest and most reliable solution.
