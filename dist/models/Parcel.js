"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const statusLogSchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    note: String,
    location: String,
});
const parcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, unique: true, required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    status: {
        type: String,
        enum: [
            "requested",
            "approved",
            "picked",
            "in_transit",
            "delivered",
            "cancelled",
        ],
        default: "requested",
    },
    statusLog: [statusLogSchema],
    fee: { type: Number, required: true },
    estimatedDelivery: { type: Date, required: true },
    actualDelivery: Date,
    notes: String,
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });
// Generate tracking ID before saving
parcelSchema.pre("save", async function (next) {
    if (this.isNew) {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        this.trackingId = `TRK-${dateStr}-${randomNum}`;
    }
    next();
});
exports.Parcel = mongoose_1.default.model("Parcel", parcelSchema);
//# sourceMappingURL=Parcel.js.map