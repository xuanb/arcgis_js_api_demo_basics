define([
    "esri/geometry/geometryEngineAsync",
    "esri/geometry/Point",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/Map",
    "esri/views/SceneView"
], function(
    geometryEngineAsync,
    Point,
    Graphic,
    GraphicsLayer,
    Map,
    SceneView
) {
    // 点符号定义：红色半透明
    var pointSym = {
        type: "simple-marker", // 自动映射为 SimpleMarkerSymbol()
        style: "circle",
        color: [255, 0, 0, 0.5],
        size: 6,
        outline: {
            // 自动映射为 SimpleLineSymbol()
            style: "solid",
            color: [255, 255, 255, 0.5]
        }
    };

    // 缓冲区符号定义：白色半透明面
    var polySym = {
        type: "simple-fill", // 自动映射为 SimpleFillSymbol()
        style: "solid",
        color: [255, 255, 255, 0.5],
        outline: {
            //自动映射为 SimpleLineSymbol()
            style: "solid",
            color: [0, 0, 0],
            width: 2
        }
    };

    // 新建map与view
    var map = new Map({
        basemap: "hybrid",
        ground: "world-elevation"
    });
    var view = new SceneView({
        container: "viewDiv",
        map: map
    });

    // 创建用于存储grpahics的图层，并添加到map中
    var layer = new GraphicsLayer();
    map.add(layer);

    var meteorPoint = new Point({
        longitude: -111.022887,
        latitude: 35.02741
    });

    view.when(function() {
        var startButton = document.getElementById("startBtn");
        startButton.addEventListener("click", function() {
            // promise chain 链式promise
            geometryEngineAsync
                .geodesicBuffer(meteorPoint, 700, "yards")
                .then(addGraphics) // 当geodesicBuffer() resolve后, 返回buffer传参至addGraphics()
                .then(zoomTo) // 当addGraphics() resolve后, 返回buffer传参至zoomTo()
                .then(calculateArea) // 当zoomTo() resolve后, 返回zoomTo的图形，图形传参至calculateArea()
                .then(printArea); // When calculateArea() resolve 后, 将计算面积结果传参至printArea()
        });
    });

    // 在图层中添加点与缓冲区图形
    function addGraphics(buffer) {
        layer.add(
            new Graphic({
                geometry: meteorPoint,
                symbol: pointSym
            })
        );
        layer.add(
            new Graphic({
                geometry: buffer,
                symbol: polySym
            })
        );

        return buffer; // 返回缓冲区，一再下一个promise中使用
    }

    // 缩放至缓冲区
    function zoomTo(geom) {
        // 当view加载后进行缩放
        return view
            .when(function() {
                return view.goTo({
                    target: geom,
                    scale: 24000,
                    tilt: 0,
                    heading: 0
                });
            })
            .then(function() {
                // 返回缩放至的图形
                return geom;
            });
    }

    // 计算缓冲区面积，单位为平方公里
    function calculateArea(polyGeom) {
        return geometryEngineAsync.geodesicArea(polyGeom, "square-kilometers");
    }

    // 将缓冲区面积打印至屏幕
    function printArea(area) {
        var areaSpan = document.getElementById("areaSpan");
        areaSpan.innerHTML = "<br><br>面积为" + area.toFixed(2) + "平方公里";
    }
});
