"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    note: String,
    location: String,
}, { _id: false });
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    type: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
        min: 0.1,
    },
    dimensions: {
        length: {
            type: Number,
            required: true,
            min: 1,
        },
        width: {
            type: Number,
            required: true,
            min: 1,
        },
        height: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
    },
    statusLog: [statusLogSchema],
    fee: {
        type: Number,
        required: true,
        min: 0,
    },
    estimatedDelivery: {
        type: Date,
        required: true,
    },
    actualDelivery: Date,
    notes: String,
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Generate tracking ID before saving
parcelSchema.pre("save", function (next) {
    if (this.isNew) {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        this.trackingId = `TRK-${dateStr}-${randomNum}`;
        // Add initial status log
        this.statusLog = [
            {
                status: this.status,
                timestamp: new Date(),
                updatedBy: this.sender,
                note: "Parcel created",
            },
        ];
    }
    next();
});
// Indexes for better performance
parcelSchema.index({ trackingId: 1 });
parcelSchema.index({ sender: 1 });
parcelSchema.index({ "receiver.email": 1 });
parcelSchema.index({ status: 1 });
parcelSchema.index({ createdAt: -1 });
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
//# sourceMappingURL=parcel.model.js.map