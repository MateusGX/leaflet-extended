import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Map, TileLayer, LayersControl, GeoJSON, Popup } from 'react-leaflet';
import _ from 'lodash';
import L from 'leaflet';
import Select from 'react-select';
import { nanoid } from 'nanoid';
import PopupSelector from "../internal/PopupSelector";
import 'leaflet/dist/leaflet.css';

const MyComponent = ({
  baseTileUrl,
  baseTileAttribution,
  markerData,
  PopupContent,
  mapLayers,
  enablePopup,
  multiIdentifier,
  children,
  latMarkerPropName,
  lngMarkerPropName
}) => {
  const [geoJSON, setGeoJSON] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [popupSelect, setPopupSelect] = useState(null);
  const [mapLayer, setMapLayer] = useState(mapLayers.length > 0 ? mapLayers[0].label : null);
  const [mapFilter, setMapFilter] = useState(null);
  useEffect(() => {
    if (markerData.length === 0) return;
    const filterResult = markerData.filter(m => {
      if (!mapFilter) return true;

      if (m[mapFilter.filter.prop] === mapFilter.filter.value) {
        return true;
      }

      return false;
    });

    const dataGroup = _.groupBy(filterResult, r => `${r[lngMarkerPropName]} / ${r[latMarkerPropName]}`);

    const dataGroupKeys = Object.keys(dataGroup);
    const features = dataGroupKeys.map(key => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Number(dataGroup[key][0][lngMarkerPropName] || 0), Number(dataGroup[key][0][latMarkerPropName] || 0)]
      },
      properties: dataGroup[key]
    }));
    const geoJson = {
      type: "FeatureCollection",
      features
    };
    setGeoJSON(geoJson);
  }, [latMarkerPropName, lngMarkerPropName, mapFilter, markerData, multiIdentifier]);
  return /*#__PURE__*/React.createElement(Map // preferCanvas
  , {
    center: [-29.8258, -51.1481],
    zoom: 16,
    style: {
      width: '100%',
      height: '100%'
    },
    onBaseLayerChange: e => {
      setMapFilter(null);
      setMapLayer(e.name);
    }
  }, /*#__PURE__*/React.createElement(TileLayer, {
    attribution: baseTileAttribution,
    url: baseTileUrl
  }), mapLayer && /*#__PURE__*/React.createElement("div", {
    className: "leaflet-bottom leaflet-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leaflet-control leaflet-bar",
    style: {
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10,
      gap: 5
    }
  }, (mapLayers.filter(l => l.label === mapLayer).length === 0 ? [{
    filters: []
  }] : mapLayers.filter(l => l.label === mapLayer))[0].filters.map(item => /*#__PURE__*/React.createElement("button", {
    key: nanoid(),
    onClick: () => {
      setMapFilter(item);
    },
    style: {
      justifyContent: 'flex-start',
      padding: 0,
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 0,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: item.color,
      width: 20,
      height: 20
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: mapFilter && mapFilter.action === item.action ? 'grey' : 'black',
      margin: 0
    }
  }, item.label)))), mapFilter !== null && /*#__PURE__*/React.createElement("button", {
    style: {
      color: 'black',
      textTransform: 'uppercase',
      border: 'none',
      backgroundColor: 'transparent',
      marginTop: 5,
      cursor: 'pointer'
    },
    onClick: () => {
      setMapFilter(null);
    }
  }, "Limpar filtro"))), /*#__PURE__*/React.createElement(LayersControl, {
    position: "topright"
  }, mapLayers.map((e, index) => {
    return /*#__PURE__*/React.createElement(LayersControl.BaseLayer, {
      checked: mapLayer ? mapLayer === e.label : index === 0,
      name: e.label,
      key: nanoid()
    }, /*#__PURE__*/React.createElement(GeoJSON, {
      key: nanoid(),
      data: geoJSON,
      onclick: e => {
        const {
          sourceTarget
        } = e;
        const {
          feature
        } = sourceTarget;
        setPopupSelect({
          value: feature.properties[0][multiIdentifier],
          label: feature.properties[0][multiIdentifier]
        });
        setPopupInfo(feature);
      },
      pointToLayer: (geoPoint, latlng) => {
        return L.circleMarker(latlng, {
          stroke: false,
          opacity: 1,
          fillOpacity: 1,
          radius: 8,
          fillColor: "#ff7800"
        });
      },
      style: e.style
    }));
  })), popupInfo && enablePopup && /*#__PURE__*/React.createElement(Popup, {
    position: [popupInfo.geometry.coordinates[1], popupInfo.geometry.coordinates[0]],
    onClose: () => {
      setPopupInfo(null);
      setPopupSelect(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 10
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: popupInfo.properties.map(r => ({
      value: r[multiIdentifier],
      label: r[multiIdentifier]
    })),
    isSearchable: true,
    defaultValue: {
      value: popupInfo.properties[0][multiIdentifier],
      label: popupInfo.properties[0][multiIdentifier]
    },
    onChange: value => setPopupSelect(value),
    value: popupSelect,
    styles: {
      menu: base => ({ ...base,
        width: "max-content",
        minWidth: "100%"
      }),
      control: base => ({ ...base,
        width: "max-content",
        minWidth: "100%"
      })
    }
  }), /*#__PURE__*/React.createElement("hr", {
    style: {
      marginTop: 10,
      marginBottom: 10,
      borderColor: 'whitesmoke'
    }
  }), popupInfo.properties.map(r => /*#__PURE__*/React.createElement(PopupSelector, {
    Popup: PopupContent,
    data: r,
    multiIdentifier: multiIdentifier,
    selectedOption: popupSelect.value,
    key: r[multiIdentifier]
  })))), children);
};

MyComponent.propTypes = {
  baseTileUrl: PropTypes.string,
  mapLayers: PropTypes.array.isRequired,
  baseTileAttribution: PropTypes.string,
  markerData: PropTypes.arrayOf(PropTypes.object),
  PopupContent: PropTypes.func,
  enablePopup: PropTypes.bool,
  multiIdentifier: PropTypes.string,
  latMarkerPropName: PropTypes.string,
  lngMarkerPropName: PropTypes.string
};
MyComponent.defaultProps = {
  baseTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  baseTileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  markerData: [],
  multiIdentifier: 'name',
  enablePopup: true,
  PopupContent: ({
    data
  }) => {
    return /*#__PURE__*/React.createElement("div", null, "- - -");
  },
  latMarkerPropName: 'lat',
  lngMarkerPropName: 'lng'
};
export default MyComponent;