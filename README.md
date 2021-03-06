WebSocket Monitor
=================
WebSocket monitor is an extension for Firefox developer tools that can be
used to monitor WebSocket connections in Firefox. It allows to inspect all
data sent and received.

See [Home Page](https://github.com/firebug/websocket-monitor/wiki)
for more details

The extension isn't signed, so you might need to set `xpinstall.signatures.required` pref to false.

Instructions
------------
1. Install the extension
3. Open a browser tab and developer tools toolbox on it (F12)
4. Select the `Web Sockets` toolbox panel
5. Initiate WebSocket connection on the page and exchanges some messages.
6. Check out content of the `Web Sockets` panel.

You might want to check out online [demo page](http://janodvarko.cz/test/websockets/)

Hacking on WebSocket Monitor
----------------------------
1. Get [JPM](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm): `git clone https://github.com/mozilla/jpm`

2. Switch to the JPM folder and [install](https://www.npmjs.org/doc/cli/npm-install.html) and [link](https://www.npmjs.org/doc/cli/npm-link.html) it via `npm install` and `npm link`. (Also needs to be done after fetching the latest changes to the JPM repo.)

3. Get the WebSocketMonitor repo: `git clone https://github.com/firebug/websocket-monitor.git` and install its dependencies via `npm install`

4. Run `jpm run -b <file path to your Firefox binary>` in the source directory to launch Firefox, which automatically creates a clean profile.

If you wish to run it with an existing profile, first create a new profile via the [Profile Manager](https://support.mozilla.org/en-US/kb/profile-manager-create-and-remove-firefox-profiles), and then run `jpm run -b <file path to your Firefox binary> -p <path to your Firefox profile (needs to start with /)>`.

Further Resources
-----------------
* Add-on SDK: https://developer.mozilla.org/en-US/Add-ons/SDK
* DevTools API: https://developer.mozilla.org/en-US/docs/Tools/DevToolsAPI
* DevTools/Hacking: https://wiki.mozilla.org/DevTools/Hacking
