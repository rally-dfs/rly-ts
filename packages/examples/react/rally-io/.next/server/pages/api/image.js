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
exports.id = "pages/api/image";
exports.ids = ["pages/api/image"];
exports.modules = {

/***/ "arweave":
/*!**************************!*\
  !*** external "arweave" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("arweave");

/***/ }),

/***/ "(api)/./src/pages/api/image.ts":
/*!********************************!*\
  !*** ./src/pages/api/image.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var arweave__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! arweave */ \"arweave\");\n/* harmony import */ var arweave__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(arweave__WEBPACK_IMPORTED_MODULE_0__);\n\nconst host = process.env.AR_HOST;\nconst port = process.env.AR_PORT;\nconst protocol = process.env.AR_PROTOCOL;\n// arwaeave init\nconst arweave = arweave__WEBPACK_IMPORTED_MODULE_0___default().init({\n    host,\n    port,\n    protocol,\n    timeout: 20000\n});\nasync function handler(req, res) {\n    if (req.method === 'POST') {\n        const arWallet = process.env.TEST_WALLET && JSON.parse(process.env.TEST_WALLET);\n        const address = await arweave.wallets.jwkToAddress(arWallet);\n        const winston = await arweave.wallets.getBalance(address);\n        console.log(\"address = \", address);\n        console.log(\"balance winstons =\", winston);\n        res.status(200).json({\n            body: req.body\n        });\n    } else {\n        res.status(405).json({\n            message: \"method not supported\"\n        });\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2ltYWdlLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM2QjtBQUU3QixLQUFLLENBQUNDLElBQUksR0FBR0MsT0FBTyxDQUFDQyxHQUFHLENBQUNDLE9BQU87QUFDaEMsS0FBSyxDQUFDQyxJQUFJLEdBQUdILE9BQU8sQ0FBQ0MsR0FBRyxDQUFDRyxPQUFPO0FBQ2hDLEtBQUssQ0FBQ0MsUUFBUSxHQUFHTCxPQUFPLENBQUNDLEdBQUcsQ0FBQ0ssV0FBVztBQUV4QyxFQUFnQjtBQUNoQixLQUFLLENBQUNDLE9BQU8sR0FBR1QsbURBQVksQ0FBQyxDQUFDO0lBQzFCQyxJQUFJO0lBQ0pJLElBQUk7SUFDSkUsUUFBUTtJQUNSSSxPQUFPLEVBQUUsS0FBSztBQUNsQixDQUFDO0FBRWMsZUFBZUMsT0FBTyxDQUNqQ0MsR0FBbUIsRUFDbkJDLEdBQW9CLEVBQ3RCLENBQUM7SUFFQyxFQUFFLEVBQUVELEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLENBQU0sT0FBRSxDQUFDO1FBRXhCLEtBQUssQ0FBQ0MsUUFBUSxHQUFHZCxPQUFPLENBQUNDLEdBQUcsQ0FBQ2MsV0FBVyxJQUFJQyxJQUFJLENBQUNDLEtBQUssQ0FBQ2pCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDYyxXQUFXO1FBQzlFLEtBQUssQ0FBQ0csT0FBTyxHQUFHLEtBQUssQ0FBQ1gsT0FBTyxDQUFDWSxPQUFPLENBQUNDLFlBQVksQ0FBQ04sUUFBUTtRQUMzRCxLQUFLLENBQUNPLE9BQU8sR0FBRyxLQUFLLENBQUNkLE9BQU8sQ0FBQ1ksT0FBTyxDQUFDRyxVQUFVLENBQUNKLE9BQU87UUFDeERLLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQVksYUFBRU4sT0FBTztRQUNqQ0ssT0FBTyxDQUFDQyxHQUFHLENBQUMsQ0FBb0IscUJBQUVILE9BQU87UUFDekNULEdBQUcsQ0FBQ2EsTUFBTSxDQUFDLEdBQUcsRUFBRUMsSUFBSSxDQUFDLENBQUM7WUFDbEJDLElBQUksRUFBRWhCLEdBQUcsQ0FBQ2dCLElBQUk7UUFDbEIsQ0FBQztJQUNMLENBQUMsTUFBTSxDQUFDO1FBQ0pmLEdBQUcsQ0FBQ2EsTUFBTSxDQUFDLEdBQUcsRUFBRUMsSUFBSSxDQUFDLENBQUM7WUFBQ0UsT0FBTyxFQUFFLENBQXNCO1FBQUMsQ0FBQztJQUM1RCxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JhbGx5LWlvLy4vc3JjL3BhZ2VzL2FwaS9pbWFnZS50cz80N2IzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcbmltcG9ydCBBcndlYXZlIGZyb20gJ2Fyd2VhdmUnXG5cbmNvbnN0IGhvc3QgPSBwcm9jZXNzLmVudi5BUl9IT1NUO1xuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LkFSX1BPUlQ7XG5jb25zdCBwcm90b2NvbCA9IHByb2Nlc3MuZW52LkFSX1BST1RPQ09MO1xuXG4vLyBhcndhZWF2ZSBpbml0XG5jb25zdCBhcndlYXZlID0gQXJ3ZWF2ZS5pbml0KHtcbiAgICBob3N0LFxuICAgIHBvcnQsXG4gICAgcHJvdG9jb2wsXG4gICAgdGltZW91dDogMjAwMDAsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICAgIHJlczogTmV4dEFwaVJlc3BvbnNlLFxuKSB7XG5cbiAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG5cbiAgICAgICAgY29uc3QgYXJXYWxsZXQgPSBwcm9jZXNzLmVudi5URVNUX1dBTExFVCAmJiBKU09OLnBhcnNlKHByb2Nlc3MuZW52LlRFU1RfV0FMTEVUKVxuICAgICAgICBjb25zdCBhZGRyZXNzID0gYXdhaXQgYXJ3ZWF2ZS53YWxsZXRzLmp3a1RvQWRkcmVzcyhhcldhbGxldCk7XG4gICAgICAgIGNvbnN0IHdpbnN0b24gPSBhd2FpdCBhcndlYXZlLndhbGxldHMuZ2V0QmFsYW5jZShhZGRyZXNzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJhZGRyZXNzID0gXCIsIGFkZHJlc3MpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmFsYW5jZSB3aW5zdG9ucyA9XCIsIHdpbnN0b24pXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgICAgIGJvZHk6IHJlcS5ib2R5XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgbWVzc2FnZTogXCJtZXRob2Qgbm90IHN1cHBvcnRlZFwiIH0pXG4gICAgfVxufSJdLCJuYW1lcyI6WyJBcndlYXZlIiwiaG9zdCIsInByb2Nlc3MiLCJlbnYiLCJBUl9IT1NUIiwicG9ydCIsIkFSX1BPUlQiLCJwcm90b2NvbCIsIkFSX1BST1RPQ09MIiwiYXJ3ZWF2ZSIsImluaXQiLCJ0aW1lb3V0IiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsImFyV2FsbGV0IiwiVEVTVF9XQUxMRVQiLCJKU09OIiwicGFyc2UiLCJhZGRyZXNzIiwid2FsbGV0cyIsImp3a1RvQWRkcmVzcyIsIndpbnN0b24iLCJnZXRCYWxhbmNlIiwiY29uc29sZSIsImxvZyIsInN0YXR1cyIsImpzb24iLCJib2R5IiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/image.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/image.ts"));
module.exports = __webpack_exports__;

})();