/// <amd-dependency path='esri/core/tsSupport/declareExtendsHelper' name='__extends' />
/// <amd-dependency path='esri/core/tsSupport/decorateHelper' name='__decorate' />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/Widget", "esri/Graphic"], function (require, exports, __extends, __decorate, decorators_1, widget_1, Widget, Graphic) {
    "use strict";
    var BezierGenerator = /** @class */ (function (_super) {
        __extends(BezierGenerator, _super);
        function BezierGenerator() {
            var _this = _super.call(this) || this;
            _this._generateBezier = _this._generateBezier.bind(_this);
            return _this;
        }
        BezierGenerator.prototype.render = function () {
            return (widget_1.tsx("button", { onclick: this._generateBezier, class: "esri-button" }, "\u8D1D\u585E\u5C14\u66F2\u7EBF"));
        };
        BezierGenerator.prototype._generateBezier = function () {
            if (this.line) {
                var json = this.line.toJSON();
                var path = this.BezierNCurve(json.paths[0]);
                var spatialReference = json.spatialReference;
                var b_line = {
                    type: "polyline",
                    hasZ: false,
                    hasM: true,
                    paths: [path],
                    spatialReference: spatialReference
                };
                var lineSymbol = {
                    type: "simple-line",
                    cap: "round",
                    join: "round",
                    width: 5,
                    color: [0, 255, 197, 1]
                };
                var grahic = new Graphic({
                    geometry: b_line,
                    symbol: lineSymbol
                });
                this.layer.graphics.add(grahic);
            }
        };
        BezierGenerator.prototype.BezierNCurve = function (originPoints) {
            var curvePoints = new Array();
            if (originPoints.length <= 3) {
                for (var i = 0; i < originPoints.length; i++) {
                    curvePoints.push(originPoints[i]);
                }
            }
            else {
                var n = originPoints.length - 1;
                for (var t = 0; t <= 1; t += 0.01) {
                    var x = 0;
                    var y = 0;
                    if (t == 0) {
                        curvePoints.push(originPoints[0]);
                        continue;
                    }
                    //有n+1个系数，即n+1项
                    for (var i = 0; i <= n; i++) {
                        var factor = this.getBezierFactor(i, n);
                        var param1 = Math.pow(1 - t, n - i);
                        var param2 = Math.pow(t, i);
                        x += factor * param1 * param2 * originPoints[i][0];
                        y += factor * param1 * param2 * originPoints[i][1];
                    }
                    curvePoints.push([x, y]);
                }
                curvePoints.push(originPoints[n]);
            }
            return curvePoints;
        };
        //计算n阶贝塞尔曲线方程的第i个参数，一共n+1项
        BezierGenerator.prototype.getBezierFactor = function (i, n) {
            //这里犯过错，曾经的写法int result=getFactorial(n) / getFactorial(i) * getFactorial(n - i);
            var result = this.getFactorial(n) /
                (this.getFactorial(i) * this.getFactorial(n - i));
            return result;
        };
        //计算n的阶乘
        BezierGenerator.prototype.getFactorial = function (n) {
            if (n == 0) {
                return 1;
            }
            else if (n == 1) {
                return 1;
            }
            else if (n == 2) {
                return 2;
            }
            else if (n == 3) {
                return 6;
            }
            else if (n == 4) {
                return 24;
            }
            else if (n == 5) {
                return 120;
            }
            else {
                var result = 1;
                for (var i = 1; i <= n; i++) {
                    result *= i;
                }
                return result;
            }
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], BezierGenerator.prototype, "line", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], BezierGenerator.prototype, "layer", void 0);
        BezierGenerator = __decorate([
            decorators_1.subclass("esri.widgets.BezierGenerator")
        ], BezierGenerator);
        return BezierGenerator;
    }(decorators_1.declared(Widget)));
    return BezierGenerator;
});
//# sourceMappingURL=BezierGenerator.js.map