"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const vite_1 = require("vite");
function svgrPlugin({ svgrOptions, esbuildOptions, } = {}) {
    return {
        name: 'vite:svgr',
        async transform(code, id) {
            if (id.endsWith('.svg')) {
                const { transform: convert } = await Promise.resolve().then(() => __importStar(require('@svgr/core')));
                const svgCode = await fs_1.default.promises.readFile(id, 'utf8');
                const componentCode = await convert(svgCode, svgrOptions, {
                    componentName: 'ReactComponent',
                    filePath: id,
                }).then((res) => {
                    const searchValue = (svgrOptions === null || svgrOptions === void 0 ? void 0 : svgrOptions.ref)
                        ? 'export default ForwardRef'
                        : 'export default ReactComponent';
                    const replaceValue = (svgrOptions === null || svgrOptions === void 0 ? void 0 : svgrOptions.ref)
                        ? 'export { ForwardRef as ReactComponent }'
                        : 'export { ReactComponent }';
                    return res.replace(searchValue, replaceValue);
                });
                const res = await (0, vite_1.transformWithEsbuild)(componentCode + '\n' + code, id, Object.assign({ loader: 'jsx' }, esbuildOptions));
                return {
                    code: res.code,
                    map: null, // TODO:
                };
            }
        },
    };
}
exports.default = svgrPlugin;
