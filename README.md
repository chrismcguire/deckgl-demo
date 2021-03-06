Deck GL talk examples

To run, clone the repo.

### To install

``` npm install ```

### To run

``` npm start ```

A bunch of these examples use mapbox tiles. If you want those to render, you'll
need to create a mapbox account and get a token (it should be free).

Once you have that, paste it here: https://github.com/chrismcguire/deckgl-demo/blob/master/src/App.js#L17

There are a few different routes for various maps here.

/simple-map
Just shows how to draw some lines on a map.

/building-map
Same as simple-map but with 3d buildings

/bike-map
Shows bike lanes in philly in a 3d building map

/simple-zip
Shows zip geojson with no map

/simple-zip-map
Same as simple-zip but with a map

/kinda-styled-zip-map
Changes the height of each feature based on the number of trees in it

/styled-zip-map
Changes the color of each zip based on trees per area
The quantile usage here is kind of fudged a bit.

/tooltip-zip-map
Adds a hover tooltip to the styled-zip-map

### Building the tree zip geojson
There's a python file in /scripts that expects the two geojson files locally.
Run that and it will write zip-trees.geojson
