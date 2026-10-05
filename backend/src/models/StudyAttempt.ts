import mongoose, { Document, Schema } from "mongoose";

interface IAnsweredQuestion {
  questionId: string;
  correct: boolean;
  points: number;
}

export interface IStudyAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  path: string;
  level: number;
  questionIds: string[];
  answeredQuestions: IAnsweredQuestion[];
  score: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const answeredQuestionSchema = new Schema<IAnsweredQuestion>(
  {
    questionId: {
      type: String,
      required: true
    },

    correct: {
      type: Boolean,
      required: true
    },

    points: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    _id: false
  }
);

const studyAttemptSchema = new Schema<IStudyAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    path: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: Number,
      required: true,
      min: 1
    },

    questionIds: {
      type: [String],
      required: true
    },

    answeredQuestions: {
      type: [answeredQuestionSchema],
      default: []
    },

    score: {
      type: Number,
      default: 0,
      min: 0
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const StudyAttempt = mongoose.model<IStudyAttempt>(
  "StudyAttempt",
  studyAttemptSchema
);