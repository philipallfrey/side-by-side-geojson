# Side by Side GeoJSON

This set of files is designed to make it easy to use the National Library of Scotland's side by side map viewer (http://maps.nls.uk/geo/explore/side-by-side/) to step through a list of coordinates contained in a GeoJSON-format file (http://geojson.org/).

These files are set up as an unpacked/temporary browser extension. They have been tested in Chrome and Firefox, but not in other browsers.

## Features
* *Next Feature*/*Previous Feature* navigation buttons
* Dynamically generated dropdown to select from values of one GeoJSON property (e.g. County)
* Display of GeoJSON properties for current feature in the navigation panel
* All locations in GeoJSON file added as markers to the left-hand map.
* Clicking on the marker opens a popup showing the GeoJSON properties of that location.

## Usage
* Clone or download the repository to get the files onto your computer.
* Open script.js with a text editor (e.g. Atom, Notepad) and change the URL to that of your GeoJSON file.
* Load the files as an extension in your browser:
  * Firefox: Go to about:debugging, click "Load Temporary Add-on", and select any of the files in the folder to which you copied this extension.
 * Chrome: Go to chrome://extensions/, enable Developer Mode, click "Load Unpacked", and select the folder to which you copied the extension.
* Go to http://maps.nls.uk/geo/explore/side-by-side/ and you should now see a new panel at the top of the screen to enable you to navigate through your coordinates.

## Example
See https://twitter.com/dr_pda/status/1016592879232282624

## Licence
Files in this repository are covered by the MIT license, see `LICENSE`.
