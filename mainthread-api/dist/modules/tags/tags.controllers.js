"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tags_middlewares_1 = __importDefault(require("./tags.middlewares"));
const tags_services_1 = require("./tags.services");
// utils 
const extracIdFromToken_1 = __importDefault(require("../../utils/authTools/extracIdFromToken"));
// logging
const log_admin_action_1 = __importDefault(require("../../logging/log.admin.action"));
const router = express_1.default.Router();
router.use(tags_middlewares_1.default);
router.get('/get-all-tags', async (req, res) => {
    try {
        const tags = await (0, tags_services_1.getAllTagsService)();
        return res.status(200).json(tags);
    }
    catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
});
router.post('/add-new-tag', async (req, res) => {
    try {
        const { name } = req.body;
        // check name
        if (!name)
            return res.status(400).json({ message: 'Name is required' });
        const tag = await (0, tags_services_1.addNewTagService)({ name });
        if (!tag)
            return res.status(400).json({ message: 'tag already exists' });
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'add tag',
            entityId: name,
            entityType: 'tag',
            metadata: { name }
        });
        return res.status(200).json({ message: 'Tag added successfully' });
    }
    catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
});
router.put('/update-tag', async (req, res) => {
    try {
        const { id, name } = req.body;
        // check name
        if (!name)
            return res.status(400).json({ message: 'Name is required' });
        const tag = await (0, tags_services_1.updateTagService)({ id, name });
        if (!tag)
            return res.status(400).json({ message: 'tag not found or already exist' });
        // logging
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'update tag',
            entityId: name,
            entityType: 'tag',
            metadata: { name }
        });
        return res.status(200).json(tag);
    }
    catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
});
router.delete('/delete-tag/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // check id
        if (!id)
            return res.status(400).json({ message: 'Id is required' });
        const tag = await (0, tags_services_1.deleteTagService)({ id });
        if (!tag)
            return res.status(400).json({ message: 'tag not found' });
        // logging
        const adminId = await (0, extracIdFromToken_1.default)(req.headers.authorization);
        await (0, log_admin_action_1.default)({
            adminId: adminId,
            action: 'delete tag',
            entityId: id,
            entityType: 'tag',
            metadata: { id }
        });
        return res.status(200).json(tag);
    }
    catch (error) {
        console.log('error from tags controllers: ', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
});
exports.default = router;
