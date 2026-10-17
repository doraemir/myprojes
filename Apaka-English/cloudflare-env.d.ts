declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    APAKA_OWNER_SETUP_HASH?: string;
    BUCKET?: R2Bucket;
  }
}
