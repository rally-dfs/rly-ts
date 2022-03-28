"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/metadata";
exports.ids = ["pages/api/metadata"];
exports.modules = {

/***/ "(api)/./src/pages/api/metadata.ts":
/*!***********************************!*\
  !*** ./src/pages/api/metadata.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\nfunction handler(req, res) {\n    if (req.method === 'POST') {\n        console.log(req.body);\n        res.status(200).json({\n            body: req.body\n        });\n    } else {\n        res.status(405).json({\n            message: \"method not supported\"\n        });\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL21ldGFkYXRhLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFFZSxRQUFRLENBQUNBLE9BQU8sQ0FDM0JDLEdBQW1CLEVBQ25CQyxHQUFvQixFQUN0QixDQUFDO0lBR0MsRUFBRSxFQUFFRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxDQUFNLE9BQUUsQ0FBQztRQUN4QkMsT0FBTyxDQUFDQyxHQUFHLENBQUNKLEdBQUcsQ0FBQ0ssSUFBSTtRQUNwQkosR0FBRyxDQUFDSyxNQUFNLENBQUMsR0FBRyxFQUFFQyxJQUFJLENBQUMsQ0FBQztZQUNsQkYsSUFBSSxFQUFFTCxHQUFHLENBQUNLLElBQUk7UUFDbEIsQ0FBQztJQUNMLENBQUMsTUFBTSxDQUFDO1FBQ0pKLEdBQUcsQ0FBQ0ssTUFBTSxDQUFDLEdBQUcsRUFBRUMsSUFBSSxDQUFDLENBQUM7WUFBQ0MsT0FBTyxFQUFFLENBQXNCO1FBQUMsQ0FBQztJQUM1RCxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JhbGx5LWlvLy4vc3JjL3BhZ2VzL2FwaS9tZXRhZGF0YS50cz9mZGUzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFuZGxlcihcbiAgICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICAgIHJlczogTmV4dEFwaVJlc3BvbnNlLFxuKSB7XG5cblxuICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVxLmJvZHkpXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgIGJvZHk6IHJlcS5ib2R5LFxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc3RhdHVzKDQwNSkuanNvbih7IG1lc3NhZ2U6IFwibWV0aG9kIG5vdCBzdXBwb3J0ZWRcIiB9KVxuICAgIH1cbn0iXSwibmFtZXMiOlsiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsImNvbnNvbGUiLCJsb2ciLCJib2R5Iiwic3RhdHVzIiwianNvbiIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/metadata.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/metadata.ts"));
module.exports = __webpack_exports__;

})();