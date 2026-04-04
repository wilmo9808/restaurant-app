"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// Endpoint público para obtener mesas activas
router.get('/active', async (req, res) => {
    try {
        const tables = await database_1.default.table.findMany({
            where: { isActive: true },
            orderBy: { number: 'asc' },
            select: { id: true, number: true, isActive: true }
        });
        res.status(200).json({ success: true, data: tables });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
