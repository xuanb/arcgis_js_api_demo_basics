define([
    "lib/CanvasFlowmapLayer",
    "esri/Graphic",
    "esri/Map",
    "esri/views/MapView",
    "papaparse/papaparse",
    "dojo/domReady!"
], function(CanvasFlowmapLayer, Graphic, Map, MapView, Papa) {
    var view = new MapView({
        container: "viewDiv",
        map: new Map({
            basemap: "dark-gray-vector"
        }),
        ui: {
            components: ["zoom", "attribution", "compass"]
        }
    });

    view.when(function() {
        Papa.parse("assets/data/xian.csv", {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: handleCsvParsingComplete
        });
    });

    function handleCsvParsingComplete(results) {
        var graphicsFromCsvRows = results.data.map(function(datum) {
            return new Graphic({
                geometry: {
                    type: "point",
                    longitude: datum.s_lon,
                    latitude: datum.s_lat
                },
                attributes: datum
            });
        });

        var canvasFlowmapLayer = new CanvasFlowmapLayer({
            graphics: graphicsFromCsvRows,
            originAndDestinationFieldIds: {
                originUniqueIdField: "s_city_id",
                originGeometry: {
                    x: "s_lon",
                    y: "s_lat",
                    spatialReference: {
                        wkid: 4326
                    }
                },
                destinationUniqueIdField: "e_city_id",
                destinationGeometry: {
                    x: "e_lon",
                    y: "e_lat",
                    spatialReference: {
                        wkid: 4326
                    }
                }
            }
        });

        view.map.layers.add(canvasFlowmapLayer);

        view.whenLayerView(canvasFlowmapLayer).then(function(
            canvasFlowmapLayerView
        ) {
            canvasFlowmapLayerView.selectGraphicsForPathDisplayById(
                "s_city_id",
                999,
                true,
                "SELECTION_NEW"
            );

            view.on("pointer-move", function(event) {
                var screenPoint = {
                    x: event.x,
                    y: event.y
                };
                view.hitTest(screenPoint).then(function(response) {
                    if (!response.results.length) {
                        return;
                    }

                    response.results.forEach(function(result) {
                        if (result.graphic.layer === canvasFlowmapLayer) {
                            if (result.graphic.isOrigin) {
                                canvasFlowmapLayerView.selectGraphicsForPathDisplayById(
                                    "s_city_id",
                                    result.graphic.attributes.s_city_id,
                                    result.graphic.attributes.isOrigin,
                                    "SELECTION_NEW"
                                );
                            } else {
                                canvasFlowmapLayerView.selectGraphicsForPathDisplayById(
                                    "e_city_id",
                                    result.graphic.attributes.e_city_id,
                                    result.graphic.attributes.isOrigin,
                                    "SELECTION_NEW"
                                );
                            }
                        }
                    });
                });
            });
        });
    }
});
