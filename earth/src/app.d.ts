// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user:
        | import("firebase-admin/lib/auth/token-verifier").DecodedIdToken
        | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
