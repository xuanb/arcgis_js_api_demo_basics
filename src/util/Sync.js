define(["dojo/_base/declare", "esri/core/watchUtils"], function(
    declare,
    watchUtils
) {
    return declare(null, {
        views: null,
        constructor: function(views) {
            this.synchronizeViews(views);
        },

        /**
         * 同步不同视图的viewpoint的utility方法
         */
        synchronizeViews: function(views) {
            var self = this;
            var handles = views.map(function(view, idx, views) {
                var others = views.concat();
                others.splice(idx, 1);
                return self.synchronizeView(view, others);
            });

            return {
                remove: function() {
                    handles.forEach(function(h) {
                        h.remove();
                    });
                    handles = null;
                }
            };
        },
        synchronizeView: function(view, others) {
            others = Array.isArray(others) ? others : [others];

            var viewpointWatchHandle;
            var viewStationaryHandle;
            var otherInteractHandlers;
            var updated = false;

            var clear = function() {
                if (otherInteractHandlers) {
                    otherInteractHandlers.forEach(function(handle) {
                        handle.remove();
                    });
                }
                viewpointWatchHandle && viewpointWatchHandle.remove();
                viewStationaryHandle && viewStationaryHandle.remove();
                otherInteractHandlers = viewpointWatchHandle = viewStationaryHandle = null;
                updated = false;
            };

            var interactWatcher = view.watch("interacting,animation", function(
                newValue
            ) {
                if (!newValue) {
                    return;
                }
                if (viewpointWatchHandle) {
                    return;
                }
                viewpointWatchHandle = view.watch("viewpoint", function(
                    newValue
                ) {
                    updated = true;
                    others.forEach(function(otherView) {
                        otherView.viewpoint = newValue;
                    });
                });
                if (!updated && view.type === "2d") {
                    others.forEach(function(otherView) {
                        otherView.viewpoint = view.viewpoint;
                    });
                }
                // 当其他视图上有交互时，立即停止同步
                otherInteractHandlers = others.map(function(otherView) {
                    return watchUtils.watch(
                        otherView,
                        "interacting,animation",
                        function(value) {
                            if (value) {
                                clear();
                            }
                        }
                    );
                });

                // 当视图静止时，停止同步
                viewStationaryHandle = watchUtils.whenTrue(
                    view,
                    "stationary",
                    clear
                );
            });

            return {
                remove: function() {
                    clear();
                    interactWatcher.remove();
                }
            };
        }
    });
});
