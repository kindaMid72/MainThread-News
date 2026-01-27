"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// middlewares
const categories_middlewares_1 = __importDefault(require("./categories.middlewares"));
// services
const categories_services_1 = require("./categories.services");
// logging
const log_admin_action_1 = __importDefault(require("../../logging/log.admin.action"));
const extracIdFromToken_1 = __importDefault(require("../../utils/authTools/extracIdFromToken"));
const router = express_1.default.Router();
router.use(categories_middlewares_1.default);
router.get('/get-all-categories', async (req, res) => {
    try {
        const categories = await (0, categories_services_1.getAllCategoriesService)();
        return res.status(200).json(categories);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/add-category', async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // check input
        if (!name)
            return res.status(400).json({ message: 'Name is required' });
        if (name.length < 3)
            return res.status(400).json({ message: 'Name must be at least 3 characters long' });
        const newCategory = {
            name,
            description,
            isActive
        };
        const category = await (0, categories_services_1.addCategoryService)(newCategory);
        if (!category)
            return res.status(400).json({ message: 'Category already exists' });
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'add category',
            entityId: name,
            entityType: 'category',
            metadata: { name }
        });
        return res.status(200).json({ message: 'Category added successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.put('/update-category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;
        // check input
        if (!id)
            return res.status(400).json({ message: 'Id is required' });
        if (!name)
            return res.status(400).json({ message: 'Name is required' });
        if (name.length < 3)
            return res.status(400).json({ message: 'Name must be at least 3 characters long' });
        const updatedCategory = {
            id,
            name,
            description,
            isActive
        };
        const updateResult = await (0, categories_services_1.updateCategoryService)(updatedCategory);
        if (!updateResult)
            return res.status(400).json({ message: 'Category already exists' });
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'update category',
            entityId: id,
            entityType: 'category',
            metadata: { name }
        });
        return res.status(200).json({ message: 'Category updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.delete('/delete-category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ message: 'Id is required' });
        const deleteResult = await (0, categories_services_1.deleteCategoryService)({ id });
        if (!deleteResult)
            return res.status(400).json({ message: 'Category not found' });
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'delete category',
            entityId: id,
            entityType: 'category',
            metadata: { id }
        });
        return res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = router;
