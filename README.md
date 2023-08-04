# 🪐 Exogram 2.0

An improved version of the platform powering NASA's Planet Patrol project's search for exoplanets and other objects of interests from the TESS mission.

https://exogram.vercel.app

### Packages

Currently, the only package is `earth`, which functions as both the client and the API. Future packages may be included in the future.

Package | Description | Language
--- | --- | ---
earth | Client & API | Svelte and TypeScript
moon | Currently unused | N/A

### Installation

Yarn is recommended for package management. To install all dependencies, run `yarn` in the root directory.

To run Exogram, you will need to create a `.env` file in the root directory with the following variables:

* `PUBLIC_FIREBASE_API_KEY`
* `GOOGLE_CLIENT_EMAIL`
* `GOOGLE_PRIVATE_KEY`
* `FIREBASE_CLIENT_EMAIL`
* `FIREBASE_PRIVATE_KEY`
* `REDIS_URI`

Access to the production values for Planet Patrol SuperUsers available on request.