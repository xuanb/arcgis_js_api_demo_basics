define([
    "esri/Map",
    "esri/layers/GeoJSONLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/renderers/smartMapping/creators/heatmap"
], function(Map, GeoJSONLayer, MapView, Legend, heatmapRendererCreator) {
    const url = "assets/data/all_month.geojson";
    // 在该csv文件中，属性有:
    // * mag - 地震等级
    // * place - 地震发生地点
    // * time - 地震发生时间

    const template = {
        title: "地震信息",
        content: "地震震级为{mag}，发生时间：{time:DateFormat}"
    };

    var layer = new GeoJSONLayer({
        url: url,
        title: "上周2.5+ 级地震",
        copyright: "USGS Earthquakes",
        popupTemplate: template
    });

    const map = new Map({
        basemap: "gray",
        layers: [layer]
    });

    const view = new MapView({
        container: "viewDiv",
        center: [107.5886974, 33.3077241],
        zoom: 4,
        map: map
    });
    view.when(function() {
        var heatmapParams = {
            layer: layer,
            view: view,
            basemap: map.basemap,
            field: "mag"
        };
        heatmapRendererCreator
            .createRenderer(heatmapParams)
            .then(function(response) {
                layer.renderer = response.renderer;
            })
            .catch(function(e) {
                console.log(e);
            });
        view.ui.add(
            new Legend({
                view: view
            }),
            "bottom-left"
        );
    });
});
