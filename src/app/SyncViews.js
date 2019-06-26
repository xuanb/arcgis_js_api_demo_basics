define([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "util/Sync"
], function(Map, MapView, SceneView, Sync) {
    var map = new Map({
        basemap: "satellite"
    });

    var view1 = new SceneView({
        id: "view1",
        container: "view1Div",
        map: map
    });

    var view2 = new MapView({
        id: "view2",
        container: "view2Div",
        map: map,
        constraints: {
            // 为了同步效果流畅，将snapToZoom设为false
            snapToZoom: false
        }
    });

    //绑定视图
    Sync([view1, view2]);
});
