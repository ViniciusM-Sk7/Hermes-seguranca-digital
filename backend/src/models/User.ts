
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  points: number;
  progress: {
    senhas: number;
    phishing: number;
    golpesDigitais: number;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    points: {
      type: Number,
      default: 0
    },

    progress: {
      senhas: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
      },
      phishing: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
      },
      golpesDigitais: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
      }
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
