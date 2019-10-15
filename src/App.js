import React from "react";
import "./App.css";

import DeckGL from "@deck.gl/react";
import { LineLayer, GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { scaleQuantile } from "d3-scale";

function fetchJSON(url) {
  return fetch(url).then(function(response) {
    return response.json();
  });
}

const MAPBOX_ACCESS_TOKEN = "<MAPBOX TOKEN HERE>";

// Initial viewport settings
const initialViewState = {
  longitude: -75.1637,
  latitude: 39.95022,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const lineData = [
  {
    sourcePosition: [-75.1637, 39.95022],
    targetPosition: [-75.1637, 39.95622]
  },
  {
    sourcePosition: [-75.1637, 39.95022],
    targetPosition: [-75.163919, 39.950606]
  },
  {
    sourcePosition: [-75.1637, 39.95022],
    targetPosition: [-75.163481, 39.950606]
  }
];

const mapboxBuildingLayer = {
  id: "3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 14,
  paint: {
    "fill-extrusion-color": "#ccc",
    "fill-extrusion-height": ["get", "height"]
  }
};

// Renders 3 lines and 3d buildings
class SimpleMap extends React.Component {
  render() {
    const layers = [new LineLayer({ id: "line-layer", data: lineData })];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

class BuildingMap extends React.Component {
  constructor(props) {
    super(props);
    this._onMapLoad = this._onMapLoad.bind(this);
  }

  _onMapLoad() {
    const map = this._map;
    map.addLayer(mapboxBuildingLayer);
  }

  render() {
    const layers = [new LineLayer({ id: "line-layer", data: lineData })];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap
          ref={ref => {
            this._map = ref && ref.getMap();
          }}
          onLoad={this._onMapLoad}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    );
  }
}

// Renders bike lanes in philly
class BikeMap extends React.Component {
  constructor(props) {
    super(props);
    this._onMapLoad = this._onMapLoad.bind(this);

    this.state = {
      pathsLoaded: false,
      paths: []
    };
  }

  componentDidMount() {
    const data = fetchJSON(
      "https://raw.githubusercontent.com/chrismcguire/deckgl-demo/master/data/Bike_Network.geojson"
    ).then(function(data) {
      return data;
    });
    this.setState({ paths: data });
  }

  _onMapLoad() {
    const map = this._map;

    map.addLayer(mapboxBuildingLayer);
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.paths,
        opacity: 1,
        stroked: false,
        extruded: true,
        filled: false,
        getElevation: 3000,
        lineWidthMinPixels: 4,
        getLineColor: [0, 160, 0, 200]
      })
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap
          ref={ref => {
            this._map = ref && ref.getMap();
          }}
          onLoad={this._onMapLoad}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    );
  }
}

class SimpleZip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipsLoaded: false,
      zips: []
    };
  }

  componentDidMount() {
    const data = fetchJSON(
      "https://raw.githubusercontent.com/chrismcguire/deckgl-demo/master/data/zip-trees.geojson"
    ).then(function(data) {
      return data;
    });
    this.setState({
      zips: data
    });
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.zips
      })
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      />
    );
  }
}

class SimpleZipMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipsLoaded: false,
      zips: []
    };
  }

  componentDidMount() {
    const data = fetchJSON(
      "https://raw.githubusercontent.com/chrismcguire/deckgl-demo/master/data/zip-trees.geojson"
    ).then(function(data) {
      return data;
    });
    this.setState({
      zips: data
    });
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.zips
      })
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

function getHeight(feature) {
  return feature.properties.count;
}

class KindaStyledZipMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipsLoaded: false,
      zips: []
    };
  }

  componentDidMount() {
    const data = fetchJSON(
      "https://raw.githubusercontent.com/chrismcguire/deckgl-demo/master/data/zip-trees.geojson"
    ).then(function(data) {
      return data;
    });
    this.setState({
      zips: data
    });
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.zips,
        extruded: true,
        getElevation: getHeight,
        getFillColor: [160, 160, 180, 256],
        opacity: 1.0
      })
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

const colors = [
  [255, 255, 204, 255],
  [217, 240, 163, 255],
  [173, 221, 142, 255],
  [120, 198, 121, 255],
  [49, 163, 84, 255],
  [0, 104, 55, 255]
];
const MAX_TREE_PER_AREA = 0.00012494821952061222;
const quantile = scaleQuantile()
  .domain([0, MAX_TREE_PER_AREA])
  .range(colors);
function getColor(feature) {
  return quantile(feature.properties.tree_per_area);
}

class StyledZipMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipsLoaded: false,
      quantile: undefined,
      zips: []
    };
  }

  componentDidMount() {
    const data = fetchJSON(
      "https://raw.githubusercontent.com/chrismcguire/deckgl-demo/master/data/trees_in_zip.geojson"
    ).then(function(data) {
      return data;
    });

    this.setState({
      zips: data,
      quantile
    });
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.zips,
        extruded: true,
        getElevation: getHeight,
        getFillColor: getColor,
        opacity: 1.0
      })
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

class TooltipStyledZipMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipsLoaded: false,
      quantile: undefined,
      zips: []
    };
  }

  componentDidMount() {
    const data = fetchJSON(
      "https://raw.githubusercontent.com/chrismcguire/deckgl-demo/master/data/trees_in_zip.geojson"
    ).then(function(data) {
      return data;
    });

    this.setState({
      zips: data,
      quantile
    });
  }

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY
          }}
        >
          {hoveredObject.properties.CODE}
        </div>
      )
    );
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.zips,
        extruded: true,
        getElevation: getHeight,
        getFillColor: getColor,
        opacity: 1.0,
        pickable: true,
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          })
      })
    ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
        {this._renderTooltip()}
      </DeckGL>
    );
  }
}

function App() {
  return (
    <Router>
      <Route exact path="/simple-map" component={SimpleMap} />
      <Route exact path="/building-map" component={BuildingMap} />
      <Route exact path="/bike-map" component={BikeMap} />
      <Route exact path="/simple-zip" component={SimpleZip} />
      <Route exact path="/simple-zip-map" component={SimpleZipMap} />
      <Route exact path="/kinda-styled-zip-map" component={KindaStyledZipMap} />
      <Route exact path="/styled-zip-map" component={StyledZipMap} />
      <Route exact path="/tooltip-zip-map" component={TooltipStyledZipMap} />
    </Router>
  );
}

export default App;
