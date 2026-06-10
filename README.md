# ![RealWorld Example App](./static/rwv-logo.png)

> **Vue 2** codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/realworld-apps/realworld) spec and API.

Project demo is available at https://vue-vuex-realworld.netlify.app/

This codebase demonstrates a fully fledged frontend application built with **Vue 2**, including CRUD operations, authentication, routing, pagination, and more — backed by the shared RealWorld end-to-end test suite.

## ⚠️ Do not start a new project from this codebase

**Vue 2 reached end of life on December 31, 2023.** It no longer receives features, bug fixes, or security patches, and neither do Vuex 3 / Vue Router 3. This repository is kept as a *reference implementation* of the RealWorld spec for the Vue 2 ecosystem — useful for studying patterns, comparing frameworks, or testing backends against a known-good frontend. It is **not** a sound base for a serious new project: start from [Vue 3](https://vuejs.org/) (or another maintained framework) instead.

If your company runs an existing Vue 2 application that cannot migrate yet, [HeroDevs Never-Ending Support for Vue 2](https://www.herodevs.com/support/nes-vue) provides commercial security patches as a drop-in replacement. It is the option [officially endorsed by the Vue team](https://v2.vuejs.org/lts/), built in partnership with Vue's creator and core team members.

## Stack

- [Vue 2.7](https://v2.vuejs.org/) with [Vuex 3](https://v3.vuex.vuejs.org/) and [Vue Router 3](https://v3.router.vuejs.org/)
- [Vite 7](https://vitejs.dev/) (via `@vitejs/plugin-vue2`) for dev server and builds
- [Bun](https://bun.sh/) as package manager / script runner
- [Playwright](https://playwright.dev/) running the official [RealWorld e2e test suite](https://github.com/realworld-apps/realworld), vendored as the `realworld` git submodule
- [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) for safe markdown rendering, [date-fns](https://date-fns.org/) for dates
- A thin `fetch` wrapper instead of axios (`src/common/api.service.js`)

The visual theme is the shared [Conduit Minimal CSS](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css) from the RealWorld spec, imported directly from the submodule (`realworld/assets/theme/styles.css`) in `src/main.js` so it stays in sync with the templates and the e2e selectors contract.

## Getting started

The spec and test suite live in a git submodule, and the app imports its theme from there, so clone with submodules:

```bash
git clone --recurse-submodules <repo-url>
# or, in an existing clone:
git submodule update --init

bun install

# serve with hot reload at http://localhost:8080
bun run serve

# production build / preview
bun run build
bun run preview
```

## Configuration

The backend API defaults to `https://api.realworld.show/api`. Point the app at any other spec-compliant RealWorld backend with the `VITE_API_URL` env var (in the shell, or an `.env.local` file):

```bash
VITE_API_URL=http://localhost:8000/api bun run serve
```

## Testing

The Jest unit tests of the original project were replaced by the official RealWorld Playwright e2e suite, which exercises the app against the spec:

```bash
# first time only: install Playwright browsers
bunx playwright install --with-deps chromium

bun run test
```

Playwright boots the Vite dev server itself (see `playwright.config.ts`).

## Linting & formatting

```bash
bun run lint     # ESLint + eslint-plugin-vue (catches Vue-specific errors, incl. in templates)
bun run format   # Prettier (code style)
```

These are complementary, not alternatives: Prettier only formats, while `eslint-plugin-vue` is currently the only linter that understands Vue SFC *templates*. `eslint-config-prettier` disables the stylistic ESLint rules so the two don't fight.

## Credits

Originally created by [Emmanuel Vilsbol](https://github.com/vilsbole) and the [gothinkster/vue-realworld-example-app](https://github.com/gothinkster/vue-realworld-example-app) contributors. See the [RealWorld project](https://github.com/realworld-apps/realworld) for the spec, and [CodebaseShow](https://codebase.show/projects/realworld) for the same app built with other stacks.
