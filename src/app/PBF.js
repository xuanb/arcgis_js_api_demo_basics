require([
    "esri/config",
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/widgets/Fullscreen"
], function(
    esriConfig,
    Map,
    FeatureLayer,
    MapView,
    Legend,
    Expand,
    Home,
    Fullscreen
) {
    //--------------------------------------------------------------------------
    //
    //  Setup Map and View
    //
    //--------------------------------------------------------------------------
    esriConfig.portalUrl = "https://xb.esricn.com/portal";

    var layer = new FeatureLayer({
        url:
            "https://xb.esricn.com/server/rest/services/Hosted/Footprint_NY/FeatureServer/0",
        definitionExpression: "CNSTRCT_YR > 0",
        title: "建筑底面",
        minScale: 72223.819286
    });

    var map = new Map({
        basemap: "dark-gray-vector",
        layers: [layer]
    });

    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: {
            spatialReference: { latestWkid: 3857, wkid: 102100 },
            x: -8230742.430923277,
            y: 4963090.881534427
        },
        zoom: 12,
        constraints: {
            snapToZoom: false,
            minScale: 72223.819286
        },

        resizeAlign: "top-left"
    });

    var applicationDiv = document.getElementById("applicationDiv");
    var slider = document.getElementById("slider");
    var sliderValue = document.getElementById("sliderValue");
    var playButton = document.getElementById("playButton");
    var titleDiv = document.getElementById("titleDiv");
    var animation = null;

    // When user drags the slider:
    //  - stops the animation
    //  - set the visualized year to the slider one.
    function inputHandler() {
        stopAnimation();
        setYear(parseInt(slider.value));
    }
    slider.addEventListener("input", inputHandler);
    slider.addEventListener("change", inputHandler);

    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener("click", function() {
        if (playButton.classList.contains("toggled")) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    view.ui.empty("top-left");
    view.ui.add(
        new Home({
            view: view
        }),
        "top-left"
    );

    view.ui.add(
        new Legend({
            view: view
        }),
        "bottom-left"
    );
    view.ui.add(
        new Fullscreen({
            view: view,
            element: applicationDiv
        }),
        "top-right"
    );

    // When the layerview is available, setup hovering interactivity
    view.whenLayerView(layer).then(setupHoverTooltip);

    // Starts the application by visualizing year 1984
    setYear(1984);

    //--------------------------------------------------------------------------
    //
    //  Methods
    //
    //--------------------------------------------------------------------------

    /**
     * Sets the current visualized construction year.
     */
    function setYear(value) {
        sliderValue.innerHTML = Math.floor(value);
        slider.value = Math.floor(value);
        layer.renderer = createRenderer(value);
    }

    /**
     * Returns a renderer with a color visual variable driven by the input
     * year. The selected year will always render buildings built in that year
     * with a light blue color. Buildings built 20+ years before the indicated
     * year are visualized with a pink color. Buildings built within that
     * 20-year time frame are assigned a color interpolated between blue and pink.
     */
    function createRenderer(year) {
        var opacityStops = [
            {
                opacity: 1,
                value: year
            },
            {
                opacity: 0,
                value: year + 1
            }
        ];

        return {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: "rgb(0, 0, 0)",
                outline: null
            },
            visualVariables: [
                {
                    type: "opacity",
                    field: "CNSTRCT_YR",
                    stops: opacityStops,
                    legendOptions: {
                        showLegend: false
                    }
                },
                {
                    type: "color",
                    field: "CNSTRCT_YR",
                    legendOptions: {
                        title: "建筑年份:"
                    },
                    stops: [
                        {
                            value: year,
                            color: "#0ff",
                            label: "in " + Math.floor(year)
                        },
                        {
                            value: year - 10,
                            color: "#f0f",
                            label: "in " + (Math.floor(year) - 20)
                        },
                        {
                            value: year - 50,
                            color: "#404",
                            label: "before " + (Math.floor(year) - 50)
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Sets up a moving tooltip that displays
     * the construction year of the hovered building.
     */
    function setupHoverTooltip(layerview) {
        var promise;
        var highlight;

        var tooltip = createTooltip();

        view.on("pointer-move", function(event) {
            if (promise) {
                promise.cancel();
            }

            promise = view.hitTest(event).then(function(hit) {
                promise = null;

                // remove current highlighted feature
                if (highlight) {
                    highlight.remove();
                    highlight = null;
                }

                var results = hit.results.filter(function(result) {
                    return result.graphic.layer === layer;
                });

                // highlight the hovered feature
                // or hide the tooltip
                if (results.length) {
                    var graphic = results[0].graphic;
                    var screenPoint = hit.screenPoint;

                    highlight = layerview.highlight(graphic);
                    tooltip.show(
                        screenPoint,
                        "Built in " + graphic.getAttribute("cnstrct_yr")
                    );
                } else {
                    tooltip.hide();
                }
            });
        });
    }

    /**
     * Starts the animation that cycle
     * through the construction years.
     */
    function startAnimation() {
        stopAnimation();
        animation = animate(parseFloat(slider.value));
        playButton.classList.add("toggled");
    }

    /**
     * Stops the animations
     */
    function stopAnimation() {
        if (!animation) {
            return;
        }

        animation.remove();
        animation = null;
        playButton.classList.remove("toggled");
    }

    /**
     * Animates the color visual variable continously
     */
    function animate(startValue) {
        var animating = true;
        var value = startValue;

        var frame = function(timestamp) {
            if (!animating) {
                return;
            }

            value += 0.5;
            if (value > 2017) {
                value = 1880;
            }

            setYear(value);

            // Update at 30fps
            setTimeout(function() {
                requestAnimationFrame(frame);
            }, 1000 / 30);
        };

        frame();

        return {
            remove: function() {
                animating = false;
            }
        };
    }

    /**
     * Creates a tooltip to display a the construction year of a building.
     */
    function createTooltip() {
        var tooltip = document.createElement("div");
        var style = tooltip.style;

        tooltip.setAttribute("role", "tooltip");
        tooltip.classList.add("tooltip");

        var textElement = document.createElement("div");
        textElement.classList.add("esri-widget");
        tooltip.appendChild(textElement);

        view.container.appendChild(tooltip);

        var x = 0;
        var y = 0;
        var targetX = 0;
        var targetY = 0;
        var visible = false;

        // move the tooltip progressively
        function move() {
            x += (targetX - x) * 0.1;
            y += (targetY - y) * 0.1;

            if (Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1) {
                x = targetX;
                y = targetY;
            } else {
                requestAnimationFrame(move);
            }

            style.transform =
                "translate3d(" +
                Math.round(x) +
                "px," +
                Math.round(y) +
                "px, 0)";
        }

        return {
            show: function(point, text) {
                if (!visible) {
                    x = point.x;
                    y = point.y;
                }

                targetX = point.x;
                targetY = point.y;
                style.opacity = 1;
                visible = true;
                textElement.innerHTML = text;

                move();
            },

            hide: function() {
                style.opacity = 0;
                visible = false;
            }
        };
    }
});
