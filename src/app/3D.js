define([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GeoJSONLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch/SketchViewModel"
], function(Map, SceneView, GeoJSONLayer, GraphicsLayer, SketchViewModel) {
    //设置二维面要素拉伸效果渲染方式
    var renderer = {
        type: "unique-value",
        defaultSymbol: {
            type: "polygon-3d",
            symbolLayers: [
                {
                    type: "extrude",
                    material: {
                        color: "white"
                    },
                    edges: {
                        type: "solid",
                        color: "gray",
                        size: 1.5
                    }
                }
            ]
        },
        visualVariables: [
            {
                type: "size",
                field: "HEIGHTS",
                valueUnit: "meters"
            }
        ]
    };
    //需要拉伸的二维要素
    var buildingsLayer = new GeoJSONLayer({
        url: "assets/data/buildings_block.geojson",
        renderer: renderer
    });
    //建筑物背景图层
    var buildingsBackgroundLayer = new GeoJSONLayer({
        url: "assets/data/buildings.geojson"
    });
    var map = new Map({
        basemap: "streets",
        ground: "world-elevation",
        layers: [buildingsLayer, buildingsBackgroundLayer]
    });

    var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: {
                x: 12122716.366640702,
                y: 4060874.3029294987,
                z: 1022.9714122554287,
                spatialReference: {
                    wkid: 3857
                }
            },
            heading: 172,
            tilt: 70
        }
    });
    // 这段主要是为了寻找合适的camera视角，设置好了就注释掉了
    // view.on("click", function(e) {
    //     console.log(view.camera);
    // });

    //定义绘制的graphicslayer
    const graphicsLayer = new GraphicsLayer();
    view.map.add(graphicsLayer);

    const busBtn = document.getElementById("bus");
    const treeBtn = document.getElementById("tree");

    view.when(function() {
        // 使用SketchViewModel添加点到GraphicsLayer中，点使用gltf模型为符号
        const sketchVM = new SketchViewModel({
            layer: graphicsLayer,
            view: view
        });

        busBtn.addEventListener("click", function() {
            // 添加object类型为点的符号类型，并设置gltf模型的相对路径
            sketchVM.pointSymbol = {
                type: "point-3d",
                symbolLayers: [
                    {
                        type: "object",
                        resource: {
                            href: "./assets/gltf/bus.glb"
                        }
                    }
                ]
            };
            sketchVM.create("point");
            deactivateButtons();
            this.classList.add("esri-button--secondary");
        });

        treeBtn.addEventListener("click", function() {
            sketchVM.pointSymbol = {
                type: "point-3d",
                symbolLayers: [
                    {
                        type: "object",
                        resource: {
                            href: "./assets/gltf/tree.glb"
                        }
                    }
                ]
            };
            deactivateButtons();
            sketchVM.create("point");
            this.classList.add("esri-button--secondary");
        });

        sketchVM.on("create", function(event) {
            if (event.state === "complete") {
                sketchVM.update(event.graphic);
                deactivateButtons();
            }
        });
        //使用Delete按键，可以删除当前选择的目标
        view.on("key-up", function(evt) {
            if (evt.key === "Delete") {
                graphicsLayer.removeMany(sketchVM.updateGraphics);
                sketchVM.reset();
            } else if (evt.key === "Escape") {
                deactivateButtons();
            }
        });
    }).catch(console.error);

    function deactivateButtons() {
        const elements = Array.prototype.slice.call(
            document.getElementsByClassName("esri-button")
        );
        elements.forEach(function(element) {
            element.classList.remove("esri-button--secondary");
        });
    }

    view.ui.add("paneDiv", "top-right");
});
