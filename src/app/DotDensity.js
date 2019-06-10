define([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/renderers/DotDensityRenderer",
    "esri/widgets/Legend",
    "esri/widgets/Expand"
], function(Map, MapView, GeoJSONLayer, DotDensityRenderer, Legend, Expand) {
    var map = new Map({
        basemap: "dark-gray-vector"
    });
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [108.78, 34.34],
        zoom: 9,
        highlightOptions: {
            fillOpacity: 0,
            color: [50, 50, 50]
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                position: "top-right",
                breakpoint: false
            }
        }
    });

    view.when().then(function() {
        const dotDensityRenderer = new DotDensityRenderer({
            referenceDotValue: 1,
            outline: null,
            referenceScale: 460467, // 1:460467 view scale
            legendOptions: {
                unit: "教育机构"
            },
            attributes: [
                {
                    field: "Kindergarten",
                    color: "#e8ca0d",
                    label: "幼儿园"
                },
                {
                    field: "K12",
                    color: "#f23c3f",
                    label: "K12"
                },
                {
                    field: "HigherEducation",
                    color: "#00b6f1",
                    label: "高等院校"
                },
                {
                    field: "ResearchFacility",
                    color: "#32ef94",
                    label: "科研机构"
                },
                {
                    field: "VocationalSchool",
                    color: "#ff7fe9",
                    label: "职业技术学校"
                },
                {
                    field: "AfterEducation",
                    color: "#e2c4a5",
                    label: "成人教育"
                },
                {
                    field: "TrainingFacility",
                    color: "#96f7ef",
                    label: "培训机构"
                },
                {
                    field: "DrivingSchool",
                    color: "#182092",
                    label: "驾校"
                }
            ]
        });

        const layer = new GeoJSONLayer({
            url: "assets/data/grids_xian_5k.geojson",
            // minScale: 2744598,
            maxScale: 120709,
            title: "西安市教育机构分布概览",
            popupTemplate: {
                title: "网格所属区域：{District}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "Kindergarten",
                                label: "幼儿园"
                            },
                            {
                                fieldName: "K12",
                                label: "K12"
                            },
                            {
                                fieldName: "HigherEducation",
                                label: "高等院校"
                            },
                            {
                                fieldName: "ResearchFacility",
                                label: "科研机构"
                            },
                            {
                                fieldName: "VocationalSchool",
                                label: "职业技术学校"
                            },
                            {
                                fieldName: "AfterEducation",
                                label: "成人教育"
                            },
                            {
                                fieldName: "TrainingFacility",
                                label: "培训机构"
                            },
                            {
                                fieldName: "DrivingSchool",
                                label: "驾校"
                            }
                        ]
                    }
                ]
            },
            renderer: dotDensityRenderer
        });

        map.add(layer);

        view.ui.add(
            [
                new Expand({
                    view: view,
                    content: new Legend({ view: view }),
                    group: "top-left",
                    expanded: true
                })
            ],
            "top-left"
        );
    });
});
