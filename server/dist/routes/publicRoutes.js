"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const router = (0, express_1.Router)();
router.get('/menu', menuController_1.getPublicMenu);
router.get('/settings/restaurant_name', menuController_1.getPublicRestaurantName);
exports.default = router;
