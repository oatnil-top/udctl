<!-- GENERATED from ud-vite-app/src/components/onboarding/agent-setup-prompt.ts -->
<!-- Do not edit by hand. Re-run: cd ud-vite-app && npm run export:agent-prompt -->
<!-- Drift gate: docusaurus-opensource/scripts/check-agent-prompt.mjs -->

I use udctl, a workspace for my tasks, notes and files. You can read and change it from the terminal with the `ud` command. My udctl server is <YOUR-SERVER-URL> — ask me for the address and use it in every command below.

1. Get `ud`. If the udctl desktop app is on this computer, use the `ud` it ships; otherwise npm install -g @oatnil/ud
2. Help me sign in. Never ask me for my password or key and never type them for me. Explain these two ways, let me pick, and wait while I do it:
   a. In my own terminal: ud login --api-url <YOUR-SERVER-URL> -n udctl-<SERVER-HOST> (it asks for my password)
   b. In udctl, Profile → API Configuration → Create Key, then in my own terminal: ud config set-context udctl-<SERVER-HOST> --api-url <YOUR-SERVER-URL> --api-key <my key>
   Use the context udctl-<SERVER-HOST> (add --context if it is not current). Never write to a context named `personal`. Name the context after my server: `udctl-` plus the host, plus the port when it is not the default, with dots and colons as hyphens (http://localhost:3300 -> udctl-localhost-3300, https://api.oatnil.com -> udctl-api-oatnil-com).
3. Learn it: `ud describe skill ud-cli` is the full guide; `ud get skills` lists more.
4. Run `ud config onboarding --done` once. It tells my udctl window you are connected.
5. Then be my guide: tell me in a few lines what I can ask you to do with udctl, ask what I am working on this week, and turn my answer into my first cards.
