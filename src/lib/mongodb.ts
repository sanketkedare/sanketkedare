import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Node.js resolves MongoDB SRV records reliably across all network environments
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Fallback gracefully if setServers is restricted in certain runtimes
}

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => {
      console.log('MongoDB connected');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/* ─── Inquiry ─────────────────────────────────────────────────────── */
const InquirySchema = new mongoose.Schema(
  {
    name:      { type: String,  required: true },
    email:     { type: String,  required: true },
    message:   { type: String,  required: true },
    createdAt: { type: Date,    default: Date.now },
    read:      { type: Boolean, default: false },
    readAt:    { type: Date },
    replied:   { type: Boolean, default: false },
    repliedAt: { type: Date },
    replyText: { type: String },
    deleted:   { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { collection: 'inquiries' }
);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

/* ─── Admin Chat Session ─────────────────────────────────────────── */
const ChatMessageSchema = new mongoose.Schema({
  id:        { type: String, required: true },
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  text:      { type: String, required: true },
  timestamp: { type: String, required: true },
  modelUsed: { type: String },
  isLocal:   { type: Boolean, default: false },
  createdAt: { type: Date,   default: Date.now },
});

const AdminChatSessionSchema = new mongoose.Schema(
  {
    title:     { type: String, default: 'New Conversation' },
    createdAt: { type: Date,   default: Date.now },
    updatedAt: { type: Date,   default: Date.now },
    messages:  [ChatMessageSchema],
  },
  { collection: 'admin_chat_sessions' }
);
export const AdminChatSession =
  mongoose.models.AdminChatSession ||
  mongoose.model('AdminChatSession', AdminChatSessionSchema);

/* ─── Resume ──────────────────────────────────────────────────────── */
/**
 * Every uploaded/linked resume is stored as a permanent record.
 * Only ONE document can have `isActive: true` at any given time.
 * The public portfolio always reads the active one.
 */
const ResumeSchema = new mongoose.Schema(
  {
    url:        { type: String, required: true },
    publicId:   { type: String, default: '' },        // Cloudinary public_id
    filename:   { type: String, default: 'resume.pdf' },
    isActive:   { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { collection: 'resumes' }
);
export const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);

/* ─── Resume helpers ─────────────────────────────────────────────── */

/** Returns the URL of the currently active resume, or null. */
export async function getActiveResumeFromDb(): Promise<string | null> {
  try {
    await dbConnect();
    let doc = await Resume.findOne({ isActive: true }).lean() as any;
    if (!doc) {
      // Auto-fallback: if no resume is marked active, automatically activate the latest uploaded one
      const latest = await Resume.findOne().sort({ uploadedAt: -1 });
      if (latest) {
        await Resume.findByIdAndUpdate(latest._id, { $set: { isActive: true } });
        doc = latest;
      }
    }
    return doc?.url ?? null;
  } catch (err) {
    console.error('[MongoDB] getActiveResumeFromDb error:', err);
    return null;
  }
}

/**
 * Inserts a new resume document and makes it the active one.
 * Deactivates all other resumes atomically.
 */
export async function addAndActivateResume(
  url: string,
  filename: string,
  publicId?: string
): Promise<any> {
  await dbConnect();
  // Deactivate all current resumes
  await Resume.updateMany({}, { $set: { isActive: false } });
  // Insert the new one as active
  const doc = await Resume.create({
    url,
    publicId:  publicId || '',
    filename:  filename || 'resume.pdf',
    isActive:  true,
    uploadedAt: new Date(),
  });
  return doc;
}

/**
 * Sets a specific resume (by _id) as active, deactivates all others.
 */
export async function setActiveResume(id: string): Promise<any> {
  await dbConnect();
  await Resume.updateMany({}, { $set: { isActive: false } });
  return Resume.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true });
}
