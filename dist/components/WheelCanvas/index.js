import React, { createRef, useEffect } from 'react';
import { WheelCanvasStyle } from './styles';
import { clamp, getQuantity } from '../../utils';
var drawRadialBorder = function (ctx, centerX, centerY, insideRadius, outsideRadius, angle) {
    ctx.beginPath();
    ctx.moveTo(centerX + (insideRadius + 1) * Math.cos(angle), centerY + (insideRadius + 1) * Math.sin(angle));
    ctx.lineTo(centerX + (outsideRadius - 1) * Math.cos(angle), centerY + (outsideRadius - 1) * Math.sin(angle));
    ctx.closePath();
    ctx.stroke();
};
var drawWheel = function (canvasRef, data, drawWheelProps) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    /* eslint-disable prefer-const */
    var outerBorderColor = drawWheelProps.outerBorderColor, outerBorderWidth = drawWheelProps.outerBorderWidth, innerRadius = drawWheelProps.innerRadius, innerBorderColor = drawWheelProps.innerBorderColor, innerBorderWidth = drawWheelProps.innerBorderWidth, radiusLineColor = drawWheelProps.radiusLineColor, radiusLineWidth = drawWheelProps.radiusLineWidth, fontFamily = drawWheelProps.fontFamily, fontWeight = drawWheelProps.fontWeight, fontSize = drawWheelProps.fontSize, fontStyle = drawWheelProps.fontStyle, perpendicularText = drawWheelProps.perpendicularText, prizeMap = drawWheelProps.prizeMap, textDistance = drawWheelProps.textDistance;
    var QUANTITY = getQuantity(prizeMap);
    outerBorderWidth *= 2;
    innerBorderWidth *= 2;
    radiusLineWidth *= 2;
    var canvas = canvasRef.current;
    if ((_a = canvas) === null || _a === void 0 ? void 0 : _a.getContext('2d')) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 500, 500);
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 0;
        var startAngle = 0;
        var outsideRadius = canvas.width / 2 - 10;
        var clampedContentDistance = clamp(0, 100, textDistance);
        var contentRadius = (outsideRadius * clampedContentDistance) / 100;
        var clampedInsideRadius = clamp(0, 100, innerRadius);
        var insideRadius = (outsideRadius * clampedInsideRadius) / 100;
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        for (var i = 0; i < data.length; i++) {
            var _l = data[i], optionSize = _l.optionSize, style = _l.style;
            var arc = (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
                (2 * Math.PI) / QUANTITY;
            var endAngle = startAngle + arc;
            ctx.fillStyle = (style && style.backgroundColor);
            ctx.beginPath();
            ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
            ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
            ctx.stroke();
            ctx.fill();
            ctx.save();
            // WHEEL RADIUS LINES
            ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
            ctx.lineWidth = radiusLineWidth;
            drawRadialBorder(ctx, centerX, centerY, insideRadius, outsideRadius, startAngle);
            if (i === data.length - 1) {
                drawRadialBorder(ctx, centerX, centerY, insideRadius, outsideRadius, endAngle);
            }
            // WHEEL OUTER BORDER
            ctx.strokeStyle =
                outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
            ctx.lineWidth = outerBorderWidth;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outsideRadius - ctx.lineWidth / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            // WHEEL INNER BORDER
            ctx.strokeStyle =
                innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
            ctx.lineWidth = innerBorderWidth;
            ctx.beginPath();
            ctx.arc(centerX, centerY, insideRadius + ctx.lineWidth / 2 - 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            // CONTENT FILL
            ctx.translate(centerX + Math.cos(startAngle + arc / 2) * contentRadius, centerY + Math.sin(startAngle + arc / 2) * contentRadius);
            var contentRotationAngle = startAngle + arc / 2;
            if (data[i].image) {
                // CASE IMAGE
                contentRotationAngle +=
                    data[i].image && !((_b = data[i].image) === null || _b === void 0 ? void 0 : _b.landscape) ? Math.PI / 2 : 0;
                ctx.rotate(contentRotationAngle);
                var img = ((_c = data[i].image) === null || _c === void 0 ? void 0 : _c._imageHTML) || new Image();
                ctx.drawImage(img, (img.width + (((_d = data[i].image) === null || _d === void 0 ? void 0 : _d.offsetX) || 0)) / -2, -(img.height -
                    (((_e = data[i].image) === null || _e === void 0 ? void 0 : _e.landscape) ? 0 : 90) + // offsetY correction for non landscape images
                    (((_f = data[i].image) === null || _f === void 0 ? void 0 : _f.offsetY) || 0)) / 2, img.width, img.height);
            }
            else {
                // CASE TEXT
                contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
                ctx.rotate(contentRotationAngle);
                var text = data[i].option;
                ctx.font = (((_g = style) === null || _g === void 0 ? void 0 : _g.fontStyle) || fontStyle) + " " + (((_h = style) === null || _h === void 0 ? void 0 : _h.fontWeight) || fontWeight) + " " + (((_j = style) === null || _j === void 0 ? void 0 : _j.fontSize) || fontSize) * 2 + "px " + (((_k = style) === null || _k === void 0 ? void 0 : _k.fontFamily) || fontFamily) + ", Helvetica, Arial";
                ctx.fillStyle = (style && style.textColor);
                ctx.fillText(text || '', -ctx.measureText(text || '').width / 2, fontSize / 2.7);
            }
            ctx.restore();
            startAngle = endAngle;
        }
    }
};
var WheelCanvas = function (_a) {
    var width = _a.width, height = _a.height, data = _a.data, outerBorderColor = _a.outerBorderColor, outerBorderWidth = _a.outerBorderWidth, innerRadius = _a.innerRadius, innerBorderColor = _a.innerBorderColor, innerBorderWidth = _a.innerBorderWidth, radiusLineColor = _a.radiusLineColor, radiusLineWidth = _a.radiusLineWidth, fontFamily = _a.fontFamily, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontStyle = _a.fontStyle, perpendicularText = _a.perpendicularText, prizeMap = _a.prizeMap, rouletteUpdater = _a.rouletteUpdater, textDistance = _a.textDistance;
    var canvasRef = createRef();
    var drawWheelProps = {
        outerBorderColor: outerBorderColor,
        outerBorderWidth: outerBorderWidth,
        innerRadius: innerRadius,
        innerBorderColor: innerBorderColor,
        innerBorderWidth: innerBorderWidth,
        radiusLineColor: radiusLineColor,
        radiusLineWidth: radiusLineWidth,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        fontSize: fontSize,
        fontStyle: fontStyle,
        perpendicularText: perpendicularText,
        prizeMap: prizeMap,
        rouletteUpdater: rouletteUpdater,
        textDistance: textDistance,
    };
    useEffect(function () {
        drawWheel(canvasRef, data, drawWheelProps);
    }, [canvasRef, data, drawWheelProps, rouletteUpdater]);
    return React.createElement(WheelCanvasStyle, { ref: canvasRef, width: width, height: height });
};
export default WheelCanvas;
