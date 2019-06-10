define([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Editor",
    "esri/widgets/Legend"
], function(Map, MapView, FeatureLayer, Editor, Legend) {
    let editConfigSchoolLayer;
    var map = new Map({
        basemap: "dark-gray-vector"
    });
    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [116.3801123, 39.9094963],
        zoom: 12
    });
    var legend = new Legend({
        view: view,
        style: "card"
    });
    view.ui.add(legend, "bottom-left");
    var layer = new FeatureLayer({
        url:
            "https://services1.arcgis.com/3VZsTPsaF6yfc9s5/ArcGIS/rest/services/%E5%8C%97%E4%BA%AC%E6%95%99%E8%82%B2%E6%9C%BA%E6%9E%84/FeatureServer/0",
        title: "北京教育机构"
    });
    map.add(layer);
    view.when(function() {
        view.popup.autoOpenEnabled = false; //disable popups
        view.map.layers.forEach(function(layer) {
            if (layer.title === "北京教育机构") {
                editConfigSchoolLayer = {
                    layer: layer,
                    fieldConfig: [
                        {
                            name: "class",
                            label: "类型"
                        },
                        {
                            name: "name",
                            label: "名称"
                        },
                        {
                            name: "address",
                            label: "地址"
                        },
                        {
                            name: "district",
                            label: "所属区域"
                        }
                    ]
                };
            }
        });
        let editor = new Editor({
            view: view,
            layerInfos: [editConfigSchoolLayer]
        });
        view.ui.add(editor, "top-right");
    });
});
