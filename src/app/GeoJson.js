define(["esri/Map", "esri/layers/GeoJSONLayer", "esri/views/MapView"], function(
    Map,
    GeoJSONLayer,
    MapView
) {
    const url = "assets/data/all_month.geojson";

    // 直接使用popupTemplate中的DateFormat将时间转换为本地时间

    const template = {
        title: "地震信息",
        content: "地震震级为{mag}，发生时间：{time:DateFormat}"
    };

    const renderer = {
        type: "simple",
        field: "mag",
        symbol: {
            type: "simple-marker",
            color: "orange",
            outline: {
                color: "white"
            }
        },
        visualVariables: [
            {
                type: "size",
                field: "mag",
                stops: [
                    {
                        value: 2.5,
                        size: "4px"
                    },
                    {
                        value: 8,
                        size: "40px"
                    }
                ]
            }
        ]
    };

    //初始化GeoJSONLayer
    const geojsonLayer = new GeoJSONLayer({
        url: url,
        copyright: "USGS Earthquakes",
        popupTemplate: template,
        renderer: renderer //optional
    });

    const map = new Map({
        basemap: "gray",
        layers: [geojsonLayer]
    });

    const view = new MapView({
        container: "viewDiv",
        center: [-168, 46],
        zoom: 3,
        map: map
    });
});
