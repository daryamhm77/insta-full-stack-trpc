"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrigins = parseOrigins;
function parseOrigins(value) {
    return (value ?? '')
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter((origin, index, all) => origin && all.indexOf(origin) === index);
}
//# sourceMappingURL=origins.js.map