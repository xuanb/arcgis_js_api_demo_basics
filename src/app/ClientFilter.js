define([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/renderers/smartMapping/creators/type",
    "esri/widgets/Legend"
], function(Map, MapView, GeoJSONLayer, typeRendererCreator, Legend) {
    var map = new Map({
        basemap: "dark-gray-vector"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [116.3801123, 39.9094963], //Web墨卡托坐标 新wkid3857 旧wkid102100
        zoom: 12
    });
    var legendContainer = document.getElementById("legendDiv");
    var legend = new Legend({
        view: view,
        container: legendContainer
    });

    view.ui.add(legend, "bottom-left");
    view.ui.add("infoDiv", "top-right");
    var fieldInfos = [
        {
            fieldName: "type",
            label: "类型"
        },
        {
            fieldName: "address",
            label: "地址"
        },
        {
            fieldName: "district",
            label: "所处区域"
        }
    ];
    let schoolLayerView;
    var layer = new GeoJSONLayer({
        url: "assets/data/edu_Beijing.geojson",
        title: "北京教育机构",
        popupTemplate: {
            title: "{name}",
            content: [
                {
                    type: "fields",
                    fieldInfos: fieldInfos
                }
            ]
        }
    });

    view.when(generateRenderer);

    function generateRenderer() {
        var typeParams = {
            layer: layer,
            basemap: map.basemap,
            field: "type",
            legendOptions: {
                title: "教育机构类型"
            }
        };

        typeRendererCreator
            .createRenderer(typeParams)
            .then(function(response) {
                layer.renderer = response.renderer;
                map.add(layer);
                view.whenLayerView(layer).then(function(layerView) {
                    schoolLayerView = layerView;
                    filterByType();
                });
            })

            .catch(function(error) {
                console.error("there was an error: ", error);
            });
    }
    function filterByType() {
        schoolLayerView.watch("updating", function() {
            legendContainer.addEventListener("click", function(e) {
                const selectedType = e.target.innerText;
                const effectType = document.getElementById("effct-select")
                    .value;
                switch (effectType) {
                    case "filter":
                        schoolLayerView.filter = {
                            where: "type = '" + selectedType + "'"
                        };
                        break;
                    case "highlight":
                        schoolLayerView.effect = {
                            filter: {
                                where: "type = '" + selectedType + "'"
                            },
                            excludedEffect: "grayscale(1) opacity(30%)"
                        };
                        break;
                }
            });
        });
        var clrButton = document.getElementById("clearFilter");
        clrButton.addEventListener("click", function() {
            const effectType = document.getElementById("effct-select").value;
            switch (effectType) {
                case "filter":
                    schoolLayerView.filter = null;
                    break;
                case "highlight":
                    schoolLayerView.effect = null;
                    break;
            }
        });
    }
});
