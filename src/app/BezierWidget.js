require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch",
    "util/Sync",
    "widget/BezierGenerator"
], function(
    Map,
    MapView,
    SceneView,
    GraphicsLayer,
    Sketch,
    Sync,
    BezierGenerator
) {
    // GraphicsLayer实例化，用于展示绘制的图形
    const gLayer = new GraphicsLayer();

    const map = new Map({
        basemap: "satellite",
        layers: [gLayer]
    });

    //可以将view1 与 view2换一下
    var view1 = new MapView({
        id: "view2",
        container: "view2Div",
        map: map
    });
    var view2 = new SceneView({
        id: "view1",
        container: "view1Div",
        map: map
    });

    var sketch1 = new Sketch({
        layer: gLayer,
        view: view1
    });

    view1.ui.add(sketch1, "top-right");
    var bwidget1 = new BezierGenerator({
        layer: gLayer,
        container: "bezier1"
    });
    view1.ui.add(bwidget1, "top-right");

    sketch1.on("create", function(event) {
        if (event.graphic.geometry.type === "polyline")
            bwidget1.line = event.graphic.geometry;
    });

    Sync([view1, view2]);
});
