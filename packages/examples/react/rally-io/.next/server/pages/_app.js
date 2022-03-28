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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/wallet-adapter-base */ \"@solana/wallet-adapter-base\");\n/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/wallet-adapter-react */ \"@solana/wallet-adapter-react\");\n/* harmony import */ var _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/wallet-adapter-react-ui */ \"@solana/wallet-adapter-react-ui\");\n/* harmony import */ var _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/wallet-adapter-wallets */ \"@solana/wallet-adapter-wallets\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__]);\n([_solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n// Use require instead of import since order matters\n__webpack_require__(/*! @solana/wallet-adapter-react-ui/styles.css */ \"./node_modules/@solana/wallet-adapter-react-ui/styles.css\");\n__webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\nconst App = ({ Component , pageProps  })=>{\n    const network = _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_1__.WalletAdapterNetwork.Devnet;\n    const endpoint = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(()=>(0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.clusterApiUrl)(network)\n    , [\n        network\n    ]);\n    const wallets = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(()=>[\n            new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__.PhantomWalletAdapter(), \n        ]\n    , [\n        network\n    ]);\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.ConnectionProvider, {\n        endpoint: endpoint,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.WalletProvider, {\n            wallets: wallets,\n            autoConnect: true,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__.WalletModalProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/cameron/Rally/rly-ts/packages/examples/react/rally-io/src/pages/_app.tsx\",\n                    lineNumber: 31,\n                    columnNumber: 21\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/cameron/Rally/rly-ts/packages/examples/react/rally-io/src/pages/_app.tsx\",\n                lineNumber: 30,\n                columnNumber: 17\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"/Users/cameron/Rally/rly-ts/packages/examples/react/rally-io/src/pages/_app.tsx\",\n            lineNumber: 29,\n            columnNumber: 13\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/Users/cameron/Rally/rly-ts/packages/examples/react/rally-io/src/pages/_app.tsx\",\n        lineNumber: 28,\n        columnNumber: 9\n    }, undefined));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWtFO0FBQ2U7QUFDWjtBQUc5QjtBQUNRO0FBRVo7QUFFbkMsRUFBb0Q7QUFDcERPLG1CQUFPLENBQUMsNkdBQTRDO0FBQ3BEQSxtQkFBTyxDQUFDLHVEQUF1QjtBQUUvQixLQUFLLENBQUNDLEdBQUcsSUFBa0IsQ0FBQyxDQUFDQyxTQUFTLEdBQUVDLFNBQVMsRUFBQyxDQUFDLEdBQUssQ0FBQztJQUNyRCxLQUFLLENBQUNDLE9BQU8sR0FBR1gsb0ZBQTJCO0lBRTNDLEtBQUssQ0FBQ2EsUUFBUSxHQUFHUCw4Q0FBTyxLQUFPRCw4REFBYSxDQUFDTSxPQUFPO01BQUcsQ0FBQ0E7UUFBQUEsT0FBTztJQUFBLENBQUM7SUFFaEUsS0FBSyxDQUFDRyxPQUFPLEdBQUdSLDhDQUFPLEtBQ2IsQ0FBQztZQUNILEdBQUcsQ0FBQ0YsZ0ZBQW9CO1FBQzVCLENBQUM7TUFDRCxDQUFDTztRQUFBQSxPQUFPO0lBQUEsQ0FBQztJQUdiLE1BQU0sNkVBQ0RWLDRFQUFrQjtRQUFDWSxRQUFRLEVBQUVBLFFBQVE7OEZBQ2pDWCx3RUFBYztZQUFDWSxPQUFPLEVBQUVBLE9BQU87WUFBRUMsV0FBVztrR0FDeENaLGdGQUFtQjtzR0FDZk0sU0FBUzt1QkFBS0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSzVDLENBQUM7QUFFRCxpRUFBZUYsR0FBRyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFsbHktaW8vLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXYWxsZXRBZGFwdGVyTmV0d29yayB9IGZyb20gJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItYmFzZSc7XG5pbXBvcnQgeyBDb25uZWN0aW9uUHJvdmlkZXIsIFdhbGxldFByb3ZpZGVyIH0gZnJvbSAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdCc7XG5pbXBvcnQgeyBXYWxsZXRNb2RhbFByb3ZpZGVyIH0gZnJvbSAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdC11aSc7XG5pbXBvcnQge1xuICAgIFBoYW50b21XYWxsZXRBZGFwdGVyLFxufSBmcm9tICdAc29sYW5hL3dhbGxldC1hZGFwdGVyLXdhbGxldHMnO1xuaW1wb3J0IHsgY2x1c3RlckFwaVVybCB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcbmltcG9ydCB7IEZDLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG4vLyBVc2UgcmVxdWlyZSBpbnN0ZWFkIG9mIGltcG9ydCBzaW5jZSBvcmRlciBtYXR0ZXJzXG5yZXF1aXJlKCdAc29sYW5hL3dhbGxldC1hZGFwdGVyLXJlYWN0LXVpL3N0eWxlcy5jc3MnKTtcbnJlcXVpcmUoJy4uL3N0eWxlcy9nbG9iYWxzLmNzcycpO1xuXG5jb25zdCBBcHA6IEZDPEFwcFByb3BzPiA9ICh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pID0+IHtcbiAgICBjb25zdCBuZXR3b3JrID0gV2FsbGV0QWRhcHRlck5ldHdvcmsuRGV2bmV0O1xuXG4gICAgY29uc3QgZW5kcG9pbnQgPSB1c2VNZW1vKCgpID0+IGNsdXN0ZXJBcGlVcmwobmV0d29yayksIFtuZXR3b3JrXSk7XG5cbiAgICBjb25zdCB3YWxsZXRzID0gdXNlTWVtbyhcbiAgICAgICAgKCkgPT4gW1xuICAgICAgICAgICAgbmV3IFBoYW50b21XYWxsZXRBZGFwdGVyKCksXG4gICAgICAgIF0sXG4gICAgICAgIFtuZXR3b3JrXVxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Q29ubmVjdGlvblByb3ZpZGVyIGVuZHBvaW50PXtlbmRwb2ludH0+XG4gICAgICAgICAgICA8V2FsbGV0UHJvdmlkZXIgd2FsbGV0cz17d2FsbGV0c30gYXV0b0Nvbm5lY3Q+XG4gICAgICAgICAgICAgICAgPFdhbGxldE1vZGFsUHJvdmlkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgICAgICAgICAgICA8L1dhbGxldE1vZGFsUHJvdmlkZXI+XG4gICAgICAgICAgICA8L1dhbGxldFByb3ZpZGVyPlxuICAgICAgICA8L0Nvbm5lY3Rpb25Qcm92aWRlcj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl0sIm5hbWVzIjpbIldhbGxldEFkYXB0ZXJOZXR3b3JrIiwiQ29ubmVjdGlvblByb3ZpZGVyIiwiV2FsbGV0UHJvdmlkZXIiLCJXYWxsZXRNb2RhbFByb3ZpZGVyIiwiUGhhbnRvbVdhbGxldEFkYXB0ZXIiLCJjbHVzdGVyQXBpVXJsIiwidXNlTWVtbyIsInJlcXVpcmUiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJuZXR3b3JrIiwiRGV2bmV0IiwiZW5kcG9pbnQiLCJ3YWxsZXRzIiwiYXV0b0Nvbm5lY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./node_modules/@solana/wallet-adapter-react-ui/styles.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@solana/wallet-adapter-react-ui/styles.css ***!
  \*****************************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@solana/web3.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@solana/wallet-adapter-base":
/*!**********************************************!*\
  !*** external "@solana/wallet-adapter-base" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-base");;

/***/ }),

/***/ "@solana/wallet-adapter-react":
/*!***********************************************!*\
  !*** external "@solana/wallet-adapter-react" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react");;

/***/ }),

/***/ "@solana/wallet-adapter-react-ui":
/*!**************************************************!*\
  !*** external "@solana/wallet-adapter-react-ui" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react-ui");;

/***/ }),

/***/ "@solana/wallet-adapter-wallets":
/*!*************************************************!*\
  !*** external "@solana/wallet-adapter-wallets" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-wallets");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();