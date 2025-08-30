"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            res.status(400).json({ message: "Validation failed", errors: error });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.js.map