define([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/ElevationLayer",
    "esri/layers/BaseElevationLayer"
], function(Map, SceneView, ElevationLayer, BaseElevationLayer) {
    var ExaggeratedElevationLayer = BaseElevationLayer.createSubclass({
        properties: {
            //定义拉伸系数100倍
            exaggeration: 100
        },
        //在添加图层至map后，图层绘制前，会调用load()方法
        load: function() {
            this._elevation = new ElevationLayer({
                url:
                    "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });
            // 在解析load()之前等待高程图层加载
            this.addResolvingPromise(this._elevation.load());
        },
        //获取view中可见的切片
        fetchTile: function(level, row, col) {
            return this._elevation.fetchTile(level, row, col).then(
                function(data) {
                    //`data`包含tile的宽度（以像素为单位），tile的高度（以像素为单位）以及每个像素的值
                    var exaggeration = this.exaggeration;
                    for (var i = 0; i < data.values.length; i++) {
                        //values为高程信息，乘以拉伸系数后重新赋值
                        data.values[i] = data.values[i] * exaggeration;
                    }
                    return data;
                }.bind(this)
            );
        }
    });

    var map = new Map({
        basemap: "satellite",
        ground: {
            layers: [new ExaggeratedElevationLayer()]
        }
    });

    var view = new SceneView({
        container: "viewDiv",
        viewingMode: "global",
        map: map,
        camera: {
            position: {
                x: -168869,
                y: 3806095,
                z: 1618269,
                spatialReference: {
                    wkid: 102100
                }
            },
            heading: 17,
            tilt: 48
        },
        constraints: {
            snapToZoom: false
        }
    });
});
