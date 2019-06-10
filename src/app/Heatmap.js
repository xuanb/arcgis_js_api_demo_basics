define([
    "esri/Map",
    "esri/layers/GeoJSONLayer",
    "esri/views/MapView",
    "esri/widgets/Legend"
], function(Map, GeoJSONLayer, MapView, Legend) {
    const url = "assets/data/all_month.geojson";
    // 在该csv文件中，属性有:
    // * mag - 地震等级
    // * place - 地震发生地点
    // * time - 地震发生时间

    const template = {
        title: "地震信息",
        content: "地震震级为{mag}，发生时间：{time:DateFormat}"
    };

    // 热力图渲染器在view中的每个像素都会分配强度值（intensity）
    // 强度值与maxPixelIntensity的比率对应colorStops中的颜色

    const renderer = {
        type: "heatmap",
        colorStops: [
            { color: "rgba(63, 40, 102, 0)", ratio: 0 },
            { color: "#472b77", ratio: 0.083 },
            { color: "#4e2d87", ratio: 0.166 },
            { color: "#563098", ratio: 0.249 },
            { color: "#5d32a8", ratio: 0.332 },
            { color: "#6735be", ratio: 0.415 },
            { color: "#7139d4", ratio: 0.498 },
            { color: "#7b3ce9", ratio: 0.581 },
            { color: "#853fff", ratio: 0.664 },
            { color: "#a46fbf", ratio: 0.747 },
            { color: "#c29f80", ratio: 0.83 },
            { color: "#e0cf40", ratio: 0.913 },
            { color: "#ffff00", ratio: 1 }
        ],
        maxPixelIntensity: 25,
        minPixelIntensity: 0
    };

    const layer = new GeoJSONLayer({
        url: url,
        title: "上周2.5+ 级地震",
        copyright: "USGS Earthquakes",
        popupTemplate: template,
        renderer: renderer
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

    view.ui.add(
        new Legend({
            view: view
        }),
        "bottom-left"
    );
});
