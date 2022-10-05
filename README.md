# Leaflet Extended (React)
![npm](https://img.shields.io/npm/v/leaflet-extended?style=for-the-badge)
## A way to load and perform filters faster on API returns for maps

Leaflet Extended is a mechanism that transforms your data into GeoJSON and transforms it into a faster and more dynamic map, with filters and layers that are much more practical to configure within React.

## Features

- Easier and more optimized popups
- Property based search
- Dynamic and easy-to-configure Filters and Layers
- Transformation of data into GeoJSON for easy handling and optimization

## Tech

| Prop | Description | Optional | DataType | Default |
| ------ | ------ | ------ | ------ | ------ |
| baseTileUrl         |  | Yes | String | ```https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png``` |
| baseTileAttribution |  | Yes | String | ```&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors``` |
| mapLayers           | array of map layers | No | Layer Array Object | 
| markerData          | array of data to be consumed | Yes | Data Array Object | ```[]``` |
| circleMarkerStyle   | style for marker | Yes | Style | ```{ stroke: false, opacity: 1, fillOpacity: 1, radius: 8, fillColor: "#ff7800" }``` |
| searchIdentifiers={['name', 'city']   | list of property names used in searches | Yes | String Array | ```[]``` |
| PopupContent        | popup content | Yes | Popup Content | ```html``` |
| enablePopup         | enable or disable popups | Yes | Boolean | ```true``` |
| multiIdentifier     | unique identifier property name | Yes | String | ```name``` |
| latMarkerPropName   | latitude property name | Yes | String | ```lat``` |
| lngMarkerPropName   | longitude property name | Yes | String | ```lng``` |

### Layer Array Object
```js
[{
    label: string, // layer name, don't repeat
    style: (f) => {
        // properties -> array of data object
        const { properties } = f;
        return Style; // return style to the marker
    },
    filters: [
        {
          label: string,  // label for the filter
          color: string,  // hex code
          action: string, // single value, do not repeat (internal use, will be removed in the future)
          filter: { 
            prop: string, // data prop name for the filters
            value: string // data value wanted
          }
        }
    ]
}]
```

### Data Array Object
The data shown is not optional, it is required in your data object.
```js
[{
    ...your data
    lat: string | number, // the prop name can be changed by latMarkerPropName
    lng: string | number, // the prop name can be changed by lngMarkerPropName
    name: string          // the prop name can be changed by multiIdentifier
}]
```

### Popup Content
```js
// data -> data object
({ data }) => {
    return <></>; // return element
}
```

### Search
```js
// identifier, value to search -> return true or false
searchElement(string, any);
```
```js
const mapRef = useRef();

const result = await ref.current.searchElement('name', 'mateus');

return (
    <LeafletExtended
    ...props
    ref={mapRef}
    searchIdentifiers={['name', 'city']}
    />
)
```

## Installation

```sh
npm i --save leaflet-extended
```