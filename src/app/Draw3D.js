define([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch/SketchViewModel"
], function(Map, SceneView, GraphicsLayer, SketchViewModel) {
    // GraphicsLayer实例化，用于展示绘制的图形
    const gLayer = new GraphicsLayer();

    const map = new Map({
        basemap: "satellite",
        layers: [gLayer],
        ground: "world-elevation"
    });

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: [9.76504392, 46.43538764, 2073.31548],
            heading: 226.79,
            tilt: 88.35
        }
    });

    const blue = [82, 82, 122, 0.9];
    const white = [255, 255, 255, 0.8];

    // 面符号，拉伸面的高度
    const extrudedPolygon = {
        type: "polygon-3d",
        symbolLayers: [
            {
                type: "extrude",
                size: 30, // 拉伸30米
                material: {
                    color: white
                },
                edges: {
                    type: "solid",
                    size: "3px",
                    color: blue
                }
            }
        ]
    };

    // 线符号，用于绘制路线
    const route = {
        type: "line-3d",
        symbolLayers: [
            {
                type: "line",
                size: "10px",
                material: {
                    color: white
                }
            }
        ]
    };

    // 点符号，用于绘制兴趣点
    const point = {
        type: "point-3d",
        symbolLayers: [
            {
                type: "icon",
                size: "20px",
                resource: { primitive: "kite" },
                outline: {
                    color: blue,
                    size: "3px"
                },
                material: {
                    color: white
                }
            }
        ]
    };

    // 实例化SketchViewModel，使用自定义的符号类型
    const sketchVM = new SketchViewModel({
        layer: gLayer,
        view: view,
        pointSymbol: point,
        polygonSymbol: extrudedPolygon,
        polylineSymbol: route
    });

    // 监听按键事件，删除/取消绘制图形

    view.on("key-up", function(evt) {
        if (evt.key === "Delete") {
            gLayer.removeMany(sketchVM.updateGraphics);
            sketchVM.reset();
        } else if (evt.key === "Escape") {
            deactivateButtons();
        }
    });

    // 绘制结束后，更新图形，并取消按键的highlight
    sketchVM.on("create", function(event) {
        if (event.state === "complete") {
            sketchVM.update(event.graphic);
            deactivateButtons();
        }
    });

    const drawButtons = Array.prototype.slice.call(
        document.getElementsByClassName("esri-button")
    );

    // 添加单击事件，用于激活图形绘制控件
    drawButtons.forEach(function(btn) {
        btn.addEventListener("click", function(event) {
            deactivateButtons();
            event.target.classList.add("esri-button--secondary");
            sketchVM.create(event.target.getAttribute("data-type"));
        });
    });

    function deactivateButtons() {
        drawButtons.forEach(function(element) {
            element.classList.remove("esri-button--secondary");
        });
    }

    view.ui.add("sketchPanel", "top-right");
});
