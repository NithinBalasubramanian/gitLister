"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserData = void 0;
const addUserData = (req, res) => {
    return res.json({
        message: 'Saved successfully'
    });
};
exports.addUserData = addUserData;
const userController = { addUserData: exports.addUserData };
exports.default = userController;
