import mongoose, { Document, Schema } from "mongoose";

export interface IStatusLog {
  status: string;
  timestamp: Date;
  updatedBy: mongoose.Types.ObjectId;
  note?: string;
  location?: string;
}

export interface IParcelDocument extends Document {
  trackingId: string;
  sender: mongoose.Types.ObjectId;
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  type: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status:
    | "requested"
    | "approved"
    | "picked"
    | "in_transit"
    | "delivered"
    | "cancelled";
  statusLog: IStatusLog[];
  fee: number;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusLogSchema = new Schema<IStatusLog>({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  note: String,
  location: String,
});

const parcelSchema = new Schema<IParcelDocument>(
  {
    trackingId: { type: String, unique: true, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  },
  { timestamps: true }
);

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

export const Parcel = mongoose.model<IParcelDocument>("Parcel", parcelSchema);
