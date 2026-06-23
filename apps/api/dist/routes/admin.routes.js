"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All admin routes are protected and require 'admin' role
router.use(auth_1.protect);
router.use((0, auth_1.authorize)('admin'));
router.get('/dashboard', admin_controller_1.AdminController.getDashboardStats);
router.get('/users', admin_controller_1.AdminController.getUsers);
router.patch('/users/:id/toggle-status', admin_controller_1.AdminController.toggleUserStatus);
router.get('/resources/pending', admin_controller_1.AdminController.getPendingResources);
router.patch('/resources/:id/status', admin_controller_1.AdminController.updateResourceStatus);
exports.adminRoutes = router;
