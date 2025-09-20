"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/parcels",
        route: parcel_route_1.ParcelRoutes,
    },
];
moduleRoutes.forEach((route) => exports.router.use(route.path, route.route));
//# sourceMappingURL=index.js.map