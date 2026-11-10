import type { ClientRateLimitInfo, Options, Store } from 'express-rate-limit';
import { model, Schema } from 'mongoose';

const rateLimitSchema = new Schema({
  _id: { type: String, required: true },
  hits: { type: Number, required: true },
  resetAt: { type: Date, required: true },
});
// MongoDB removes a counter automatically once its window is over.
rateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitModel = model('RateLimit', rateLimitSchema, 'rate_limits');

// express-rate-limit store that keeps counters in MongoDB, so every serverless instance shares them
// (the default in-memory store is per instance). One atomic upsert per hit; no extra service needed.
export class MongoRateLimitStore implements Store {
  private windowMs = 15 * 60 * 1000;

  init(options: Options): void {
    this.windowMs = options.windowMs;
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const now = new Date();
    const nextReset = new Date(now.getTime() + this.windowMs);
    const stillActive = { $gt: ['$resetAt', now] };

    const counter = await RateLimitModel.findOneAndUpdate(
      { _id: key },
      [
        {
          $set: {
            hits: { $cond: [stillActive, { $add: ['$hits', 1] }, 1] },
            resetAt: { $cond: [stillActive, '$resetAt', nextReset] },
          },
        },
      ],
      { upsert: true, returnDocument: 'after', updatePipeline: true },
    ).lean();

    return { totalHits: counter?.hits ?? 1, resetTime: counter?.resetAt ?? nextReset };
  }

  async decrement(key: string): Promise<void> {
    await RateLimitModel.updateOne({ _id: key, hits: { $gt: 0 } }, { $inc: { hits: -1 } });
  }

  async resetKey(key: string): Promise<void> {
    await RateLimitModel.deleteOne({ _id: key });
  }
}
