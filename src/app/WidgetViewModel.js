define([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/widgets/Print/PrintViewModel",
    "dojo/domReady!"
], function(Map, MapView, GeoJSONLayer, PrintViewModel) {
    const url = "assets/data/all_month.geojson";
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

    const printBtn = document.getElementById("print");
    view.ui.add(printBtn, "top-right");
    const printVM = new PrintViewModel({
        view,
        printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });

    printBtn.addEventListener("click", () => {
        printVM
            .print()
            .then(response => {
                window.open(response.url, "_blank");
            })
            .catch(error => console.warn(error));
    });
});
