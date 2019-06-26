define([
    "esri/views/MapView",
    "esri/widgets/Bookmarks",
    "esri/widgets/BasemapGallery",
    "esri/widgets/CoordinateConversion",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/Locate",
    "esri/widgets/Legend",
    "esri/widgets/DistanceMeasurement2D",
    "esri/widgets/AreaMeasurement2D",
    "esri/widgets/Print",
    "esri/widgets/Track",
    "esri/widgets/Search",
    "esri/layers/GeoJSONLayer",
    "esri/Map"
], function(
    MapView,
    Bookmarks,
    BasemapGallery,
    CoordinateConversion,
    Expand,
    LayerList,
    Locate,
    Legend,
    DistanceMeasurement2D,
    AreaMeasurement2D,
    Print,
    Track,
    Search,
    GeoJSONLayer,
    Map
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
    view.when(function() {
        const themePicker = document.createElement("select");
        themePicker.classList.add("styled-select");
        const themes = [
            "light",
            "dark",
            "light-blue",
            "dark-blue",
            "light-green",
            "dark-green",
            "light-purple",
            "dark-purple",
            "light-red",
            "dark-red",
            "blue"
        ];
        themePicker.innerHTML = themes.map(
            theme => `<option value=${theme}>${theme}</option>`
        );
        view.ui.add(themePicker, {
            position: "top-left",
            index: 0
        });
        let defaultStylesheet = document.getElementById("esriStylesheet");
        themePicker.addEventListener("change", () => {
            defaultStylesheet.setAttribute(
                "href",
                `./../node_modules/arcgis-js-api/themes/${
                    themePicker.value
                }/main.css`
            );
        });
        var searchWidget = new Search({
            view: view
        });

        view.ui.add(searchWidget, {
            position: "top-right",
            index: 2
        });
        // Bookmarks
        view.ui.add(
            new Expand({
                view: view,
                group: "top-right",
                content: new Bookmarks({
                    view: view
                })
            }),
            "top-right"
        );

        // Basemap Gallery
        view.ui.add(
            new Expand({
                view: view,
                group: "top-right",
                content: new BasemapGallery({
                    view: view
                })
            }),
            "top-right"
        );

        // Coordinate Conversion
        view.ui.add(
            new CoordinateConversion({
                view: view
            }),
            "bottom-right"
        );

        //  Layer List
        view.ui.add(
            new Expand({
                view: view,
                group: "top-right",
                content: new LayerList({
                    view: view
                })
            }),
            "top-right"
        );

        // Legend
        view.ui.add(
            new Expand({
                view: view,
                group: "top-right",
                content: new Legend({
                    view: view
                })
            }),
            "top-right"
        );

        // Card style legend
        view.ui.add(
            new Expand({
                view: view,
                group: "top-right",
                tooltip: "Legend (card)",
                content: new Legend({
                    view: view,
                    style: "card"
                })
            }),
            "top-left"
        );

        // Locate
        view.ui.add(
            new Locate({
                view: view
            }),
            "top-left"
        );

        // Track
        var track = new Track({
            view: view
        });
        view.ui.add(track, "top-left");

        // Print
        view.ui.add(
            new Expand({
                view: view,
                group: "top-right",
                content: new Print({
                    view: view,
                    printServiceUrl:
                        "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                })
            }),
            "top-right"
        );

        // Measurement
        view.ui.add(
            new Expand({
                view: view,
                group: "bottom-right",
                content: new DistanceMeasurement2D({
                    view: view
                })
            }),
            "bottom-right"
        );
        view.ui.add(
            new Expand({
                view: view,
                group: "bottom-right",
                content: new AreaMeasurement2D({
                    view: view
                })
            }),
            "bottom-right"
        );
    });
});
