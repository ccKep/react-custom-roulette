var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useEffect, useRef, useState } from 'react';
import WebFont from 'webfontloader';
import { getQuantity, getRotationDegrees, isCustomFont, makeClassKey, } from '../../utils';
import { roulettePointer } from '../common/images';
import { RotationContainer, RouletteContainer, RoulettePointerImage, } from './styles';
import { DEFAULT_BACKGROUND_COLORS, DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_FONT_STYLE, DEFAULT_FONT_WEIGHT, DEFAULT_INNER_BORDER_COLOR, DEFAULT_INNER_BORDER_WIDTH, DEFAULT_INNER_RADIUS, DEFAULT_OUTER_BORDER_COLOR, DEFAULT_OUTER_BORDER_WIDTH, DEFAULT_RADIUS_LINE_COLOR, DEFAULT_RADIUS_LINE_WIDTH, DEFAULT_SPIN_DURATION, DEFAULT_TEXT_COLORS, DEFAULT_TEXT_DISTANCE, WEB_FONTS, DISABLE_INITIAL_ANIMATION, } from '../../strings';
import WheelCanvas from '../WheelCanvas';
var STARTED_SPINNING = 'started-spinning';
var START_SPINNING_TIME = 2600;
var CONTINUE_SPINNING_TIME = 750;
var STOP_SPINNING_TIME = 8000;
export var Wheel = function (_a) {
    var mustStartSpinning = _a.mustStartSpinning, prizeNumber = _a.prizeNumber, data = _a.data, _b = _a.onStopSpinning, onStopSpinning = _b === void 0 ? function () { return null; } : _b, _c = _a.backgroundColors, backgroundColors = _c === void 0 ? DEFAULT_BACKGROUND_COLORS : _c, _d = _a.textColors, textColors = _d === void 0 ? DEFAULT_TEXT_COLORS : _d, _e = _a.outerBorderColor, outerBorderColor = _e === void 0 ? DEFAULT_OUTER_BORDER_COLOR : _e, _f = _a.outerBorderWidth, outerBorderWidth = _f === void 0 ? DEFAULT_OUTER_BORDER_WIDTH : _f, _g = _a.innerRadius, innerRadius = _g === void 0 ? DEFAULT_INNER_RADIUS : _g, _h = _a.innerBorderColor, innerBorderColor = _h === void 0 ? DEFAULT_INNER_BORDER_COLOR : _h, _j = _a.innerBorderWidth, innerBorderWidth = _j === void 0 ? DEFAULT_INNER_BORDER_WIDTH : _j, _k = _a.radiusLineColor, radiusLineColor = _k === void 0 ? DEFAULT_RADIUS_LINE_COLOR : _k, _l = _a.radiusLineWidth, radiusLineWidth = _l === void 0 ? DEFAULT_RADIUS_LINE_WIDTH : _l, _m = _a.fontFamily, fontFamily = _m === void 0 ? WEB_FONTS[0] : _m, _o = _a.fontSize, fontSize = _o === void 0 ? DEFAULT_FONT_SIZE : _o, _p = _a.fontWeight, fontWeight = _p === void 0 ? DEFAULT_FONT_WEIGHT : _p, _q = _a.fontStyle, fontStyle = _q === void 0 ? DEFAULT_FONT_STYLE : _q, _r = _a.perpendicularText, perpendicularText = _r === void 0 ? false : _r, _s = _a.textDistance, textDistance = _s === void 0 ? DEFAULT_TEXT_DISTANCE : _s, _t = _a.spinDuration, spinDuration = _t === void 0 ? DEFAULT_SPIN_DURATION : _t, _u = _a.startingOptionIndex, startingOptionIndex = _u === void 0 ? -1 : _u, _v = _a.pointerProps, pointerProps = _v === void 0 ? {} : _v, _w = _a.disableInitialAnimation, disableInitialAnimation = _w === void 0 ? DISABLE_INITIAL_ANIMATION : _w;
    var _x, _y;
    var _z = useState(__spreadArrays(data)), wheelData = _z[0], setWheelData = _z[1];
    var _0 = useState([[0]]), prizeMap = _0[0], setPrizeMap = _0[1];
    var _1 = useState(0), startRotationDegrees = _1[0], setStartRotationDegrees = _1[1];
    var _2 = useState(0), finalRotationDegrees = _2[0], setFinalRotationDegrees = _2[1];
    var _3 = useState(false), hasStartedSpinning = _3[0], setHasStartedSpinning = _3[1];
    var _4 = useState(false), hasStoppedSpinning = _4[0], setHasStoppedSpinning = _4[1];
    var _5 = useState(false), isCurrentlySpinning = _5[0], setIsCurrentlySpinning = _5[1];
    var _6 = useState(false), isDataUpdated = _6[0], setIsDataUpdated = _6[1];
    var _7 = useState(false), rouletteUpdater = _7[0], setRouletteUpdater = _7[1];
    var _8 = useState(0), loadedImagesCounter = _8[0], setLoadedImagesCounter = _8[1];
    var _9 = useState(0), totalImages = _9[0], setTotalImages = _9[1];
    var _10 = useState(false), isFontLoaded = _10[0], setIsFontLoaded = _10[1];
    var mustStopSpinning = useRef(false);
    var imageCache = useRef(new Map());
    var classKey = makeClassKey(5);
    var normalizedSpinDuration = Math.max(0.01, spinDuration);
    var startSpinningTime = START_SPINNING_TIME * normalizedSpinDuration;
    var continueSpinningTime = CONTINUE_SPINNING_TIME * normalizedSpinDuration;
    var stopSpinningTime = STOP_SPINNING_TIME * normalizedSpinDuration;
    var totalSpinningTime = startSpinningTime + continueSpinningTime + stopSpinningTime;
    useEffect(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        var initialMapNum = 0;
        var auxPrizeMap = [];
        var dataLength = ((_a = data) === null || _a === void 0 ? void 0 : _a.length) || 0;
        var wheelDataAux = [{ option: '', optionSize: 1 }];
        var fontsToFetch = isCustomFont((_b = fontFamily) === null || _b === void 0 ? void 0 : _b.trim()) ? [fontFamily] : [];
        var _loop_1 = function (i) {
            var fontArray = ((_e = (_d = (_c = data[i]) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.fontFamily) === null || _e === void 0 ? void 0 : _e.split(',')) || [];
            fontArray = fontArray.map(function (font) { return font.trim(); }).filter(isCustomFont);
            fontsToFetch.push.apply(fontsToFetch, fontArray);
            wheelDataAux[i] = __assign(__assign({}, data[i]), { style: {
                    backgroundColor: ((_f = data[i].style) === null || _f === void 0 ? void 0 : _f.backgroundColor) || ((_g = backgroundColors) === null || _g === void 0 ? void 0 : _g[i % ((_h = backgroundColors) === null || _h === void 0 ? void 0 : _h.length)]) ||
                        DEFAULT_BACKGROUND_COLORS[0],
                    fontFamily: ((_j = data[i].style) === null || _j === void 0 ? void 0 : _j.fontFamily) || fontFamily || DEFAULT_FONT_FAMILY,
                    fontSize: ((_k = data[i].style) === null || _k === void 0 ? void 0 : _k.fontSize) || fontSize || DEFAULT_FONT_SIZE,
                    fontWeight: ((_l = data[i].style) === null || _l === void 0 ? void 0 : _l.fontWeight) || fontWeight || DEFAULT_FONT_WEIGHT,
                    fontStyle: ((_m = data[i].style) === null || _m === void 0 ? void 0 : _m.fontStyle) || fontStyle || DEFAULT_FONT_STYLE,
                    textColor: ((_o = data[i].style) === null || _o === void 0 ? void 0 : _o.textColor) || ((_p = textColors) === null || _p === void 0 ? void 0 : _p[i % ((_q = textColors) === null || _q === void 0 ? void 0 : _q.length)]) ||
                        DEFAULT_TEXT_COLORS[0],
                } });
            auxPrizeMap.push([]);
            for (var j = 0; j < (wheelDataAux[i].optionSize || 1); j++) {
                auxPrizeMap[i][j] = initialMapNum++;
            }
            if (data[i].image) {
                setTotalImages(function (prevCounter) { return prevCounter + 1; });
                if (((_r = data[i].image) === null || _r === void 0 ? void 0 : _r.uri) !== undefined &&
                    imageCache.current.has(((_s = data[i].image) === null || _s === void 0 ? void 0 : _s.uri) || '')) {
                    var img = imageCache.current.get(data[i].image.uri);
                    wheelDataAux[i].image = {
                        uri: ((_t = data[i].image) === null || _t === void 0 ? void 0 : _t.uri) || '',
                        offsetX: ((_u = data[i].image) === null || _u === void 0 ? void 0 : _u.offsetX) || 0,
                        offsetY: ((_v = data[i].image) === null || _v === void 0 ? void 0 : _v.offsetY) || 0,
                        landscape: ((_w = data[i].image) === null || _w === void 0 ? void 0 : _w.landscape) || false,
                        sizeMultiplier: ((_x = data[i].image) === null || _x === void 0 ? void 0 : _x.sizeMultiplier) || 1,
                        _imageHTML: img,
                    };
                    setLoadedImagesCounter(function (prevCounter) { return prevCounter + 1; });
                }
                else {
                    var img_1 = new Image();
                    img_1.src = ((_y = data[i].image) === null || _y === void 0 ? void 0 : _y.uri) || '';
                    img_1.onload = function () {
                        var _a, _b, _c, _d, _e, _f, _g;
                        img_1.height = 200 * (((_a = data[i].image) === null || _a === void 0 ? void 0 : _a.sizeMultiplier) || 1);
                        img_1.width = (img_1.naturalWidth / img_1.naturalHeight) * img_1.height;
                        wheelDataAux[i].image = {
                            uri: ((_b = data[i].image) === null || _b === void 0 ? void 0 : _b.uri) || '',
                            offsetX: ((_c = data[i].image) === null || _c === void 0 ? void 0 : _c.offsetX) || 0,
                            offsetY: ((_d = data[i].image) === null || _d === void 0 ? void 0 : _d.offsetY) || 0,
                            landscape: ((_e = data[i].image) === null || _e === void 0 ? void 0 : _e.landscape) || false,
                            sizeMultiplier: ((_f = data[i].image) === null || _f === void 0 ? void 0 : _f.sizeMultiplier) || 1,
                            _imageHTML: img_1,
                        };
                        setLoadedImagesCounter(function (prevCounter) { return prevCounter + 1; });
                        setRouletteUpdater(function (prevState) { return !prevState; });
                        if ((_g = data[i].image) === null || _g === void 0 ? void 0 : _g.uri) {
                            imageCache.current.set(data[i].image.uri, img_1);
                        }
                    };
                }
            }
        };
        for (var i = 0; i < dataLength; i++) {
            _loop_1(i);
        }
        if (((_z = fontsToFetch) === null || _z === void 0 ? void 0 : _z.length) > 0) {
            try {
                WebFont.load({
                    google: {
                        families: Array.from(new Set(fontsToFetch.filter(function (font) { return !!font; }))),
                    },
                    timeout: 1000,
                    fontactive: function () {
                        setRouletteUpdater(!rouletteUpdater);
                    },
                    active: function () {
                        setIsFontLoaded(true);
                        setRouletteUpdater(!rouletteUpdater);
                    },
                });
            }
            catch (err) {
                console.log('Error loading webfonts:', err);
            }
        }
        else {
            setIsFontLoaded(true);
        }
        setWheelData(__spreadArrays(wheelDataAux));
        setPrizeMap(auxPrizeMap);
        setStartingOption(startingOptionIndex, auxPrizeMap);
        setIsDataUpdated(true);
    }, [data, backgroundColors, textColors]);
    useEffect(function () {
        var _a;
        if (mustStartSpinning && !isCurrentlySpinning) {
            setIsCurrentlySpinning(true);
            startSpinning();
            var selectedPrize = prizeMap[prizeNumber][Math.floor(Math.random() * ((_a = prizeMap[prizeNumber]) === null || _a === void 0 ? void 0 : _a.length))];
            var finalRotationDegreesCalculated = getRotationDegrees(selectedPrize, getQuantity(prizeMap));
            setFinalRotationDegrees(finalRotationDegreesCalculated);
        }
    }, [mustStartSpinning]);
    useEffect(function () {
        if (hasStoppedSpinning) {
            setIsCurrentlySpinning(false);
            setStartRotationDegrees(finalRotationDegrees);
        }
    }, [hasStoppedSpinning]);
    var startSpinning = function () {
        setHasStartedSpinning(true);
        setHasStoppedSpinning(false);
        mustStopSpinning.current = true;
        setTimeout(function () {
            if (mustStopSpinning.current) {
                mustStopSpinning.current = false;
                setHasStartedSpinning(false);
                setHasStoppedSpinning(true);
                onStopSpinning();
            }
        }, totalSpinningTime);
    };
    var setStartingOption = function (optionIndex, optionMap) {
        var _a, _b;
        if (startingOptionIndex >= 0) {
            var idx = Math.floor(optionIndex) % ((_a = optionMap) === null || _a === void 0 ? void 0 : _a.length);
            var startingOption = optionMap[idx][Math.floor(((_b = optionMap[idx]) === null || _b === void 0 ? void 0 : _b.length) / 2)];
            setStartRotationDegrees(getRotationDegrees(startingOption, getQuantity(optionMap), false));
        }
    };
    var getRouletteClass = function () {
        if (hasStartedSpinning) {
            return STARTED_SPINNING;
        }
        return '';
    };
    if (!isDataUpdated) {
        return null;
    }
    return (React.createElement(RouletteContainer, { style: !isFontLoaded ||
            (totalImages > 0 && loadedImagesCounter !== totalImages)
            ? { visibility: 'hidden' }
            : {} },
        React.createElement(RotationContainer, { className: getRouletteClass(), classKey: classKey, startSpinningTime: startSpinningTime, continueSpinningTime: continueSpinningTime, stopSpinningTime: stopSpinningTime, startRotationDegrees: startRotationDegrees, finalRotationDegrees: finalRotationDegrees, disableInitialAnimation: disableInitialAnimation },
            React.createElement(WheelCanvas, { width: "900", height: "900", data: wheelData, outerBorderColor: outerBorderColor, outerBorderWidth: outerBorderWidth, innerRadius: innerRadius, innerBorderColor: innerBorderColor, innerBorderWidth: innerBorderWidth, radiusLineColor: radiusLineColor, radiusLineWidth: radiusLineWidth, fontFamily: fontFamily, fontWeight: fontWeight, fontStyle: fontStyle, fontSize: fontSize, perpendicularText: perpendicularText, prizeMap: prizeMap, rouletteUpdater: rouletteUpdater, textDistance: textDistance })),
        React.createElement(RoulettePointerImage, { style: (_x = pointerProps) === null || _x === void 0 ? void 0 : _x.style, src: ((_y = pointerProps) === null || _y === void 0 ? void 0 : _y.src) || roulettePointer.src, alt: "roulette-static" })));
};
