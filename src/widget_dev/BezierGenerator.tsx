/// <amd-dependency path='esri/core/tsSupport/declareExtendsHelper' name='__extends' />
/// <amd-dependency path='esri/core/tsSupport/decorateHelper' name='__decorate' />

import {
    subclass,
    declared,
    property
} from "esri/core/accessorSupport/decorators";
import { renderable, tsx } from "esri/widgets/support/widget";

import Widget = require("esri/widgets/Widget");
import Geometry = require("esri/geometry/Geometry");
import Graphic = require("esri/Graphic");
import GraphicsLayer = require("esri/layers/GraphicsLayer");

@subclass("esri.widgets.BezierGenerator")
class BezierGenerator extends declared(Widget) {
    @property()
    @renderable()
    line: Geometry;
    @property()
    @renderable()
    layer: GraphicsLayer;
    constructor() {
        super();
        this._generateBezier = this._generateBezier.bind(this);
    }

    render() {
        return (
            <button onclick={this._generateBezier} class="esri-button">
                贝塞尔曲线
            </button>
        );
    }

    private _generateBezier() {
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
    }

    private BezierNCurve(originPoints: Array<number[]>): Array<number[]> {
        var curvePoints = new Array<number[]>();
        if (originPoints.length <= 3) {
            for (var i = 0; i < originPoints.length; i++) {
                curvePoints.push(originPoints[i]);
            }
        } else {
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
    }
    //计算n阶贝塞尔曲线方程的第i个参数，一共n+1项
    private getBezierFactor(i: number, n: number): number {
        var result =
            this.getFactorial(n) /
            (this.getFactorial(i) * this.getFactorial(n - i));
        return result;
    }
    //计算n的阶乘
    private getFactorial(n: number): number {
        if (n == 0) {
            return 1;
        } else if (n == 1) {
            return 1;
        } else if (n == 2) {
            return 2;
        } else if (n == 3) {
            return 6;
        } else if (n == 4) {
            return 24;
        } else if (n == 5) {
            return 120;
        } else {
            var result = 1;
            for (var i = 1; i <= n; i++) {
                result *= i;
            }
            return result;
        }
    }
}

export = BezierGenerator;
