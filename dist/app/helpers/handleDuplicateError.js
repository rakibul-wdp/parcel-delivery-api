"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    return {
        statusCode: 400,
        message: `${extractedMessage} is already exists`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
//# sourceMappingURL=handleDuplicateError.js.map