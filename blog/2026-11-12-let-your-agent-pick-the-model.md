---
title: "Let Your Agent Pick the Model: Light Jobs to Fast Models, Hard Ones to the Strongest"
description: "Picking a model before every job you hand out is a decision of its own. In udctl, write the model-choice rule once and Alfred picks and dispatches by it: Haiku for a typo, Fable for a UI design, a second review pass on Codex. Want to choose yourself? Switch the CLI for that one message."
authors: [lintao]
tags: [feature, guide]
date: 2026-11-12
image: https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/01-alfred-picks.jpg
---

Fixing a typo and designing a whole interface shouldn't cost the same, or take the same wait. But if you have to decide "which model this time?" before every job you hand out, that decision becomes a job of its own.

This post shows one way to handle it in [udctl](/) (UnDercontrol): write your model-choice rule once and let Alfred pick and dispatch by it. You skip the judgment call before every dispatch, light jobs stop queuing behind your strongest model, and hard jobs don't land on a model that can't handle them.

We made a 100-second video of this. The dispatches in it come from a real run. This post is the written version.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: '1rem'}}>
  <iframe
    src="https://www.youtube-nocookie.com/embed/j3Pvh3PWjiM"
    title="Your agent picks the model: light jobs to fast models, hard ones to the best"
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  ></iframe>
</div>

[Watch on YouTube](https://www.youtube.com/watch?v=j3Pvh3PWjiM)

![You say "Dispatch these." Alfred reads the rule and sends fix a typo, tidy the tags, build the form, design the UI and final review to claude-haiku, claude-sonnet, claude-opus, claude-fable and codex](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/01-alfred-picks.jpg)

<!-- truncate -->

## Each model is one command, so you can see what runs

In udctl, each model is its own Agent CLI, with the model right in the command. The `claude-fable` row is `claude --dangerously-skip-permissions --model fable`; `claude-haiku` is the same command with `--model haiku`.

It's not just Claude. Codex, Pi: whatever is installed on your machine, you can add, with "New CLI..." at the bottom of the list. Claude Code, Codex, OpenCode, or any terminal-based agent plugs in the same way.

![The Agent CLI list in settings: Codex, Pi, and four Claude Code rows for Fable, Haiku, Opus and Sonnet, with the --model flag at the end of each command underlined](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/02-agent-cli-list.jpg)

## Set the usual split once and stop thinking about it

Each agent has its own default: Opus for the coder, Fable for the designer, Codex for the reviewer. In the agent's edit form, the CLI you pick under "Runs with" is its default.

![The reviewer's edit form: Runs with is set to Codex, marked available on one of your machines](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/03-agent-default.jpg)

## No more picking a model every time you hand out a job

A default only covers what an agent normally uses. The same coder might fix a typo in a button label today and build a whole form tomorrow, and one model for both is a poor fit. So every job you hand out means picking a model again.

Write that judgment down as a rule, once. Global Instructions in settings go into the prompt of every workspace session: yours, and those of the agents you trigger. The rule in the video reads:

> Choosing a model: default to claude-opus; simple jobs use claude-sonnet; tiny, repetitive jobs use claude-haiku; complex jobs that need strong design use claude-fable; for code review, have codex take a look as well.

![The Global Instructions box holding the model-choice rule](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/04-global-rule.jpg)

## One sentence, and each job lands on the right model

With the rule written, you can hand the model decision to Alfred too. In the video, the demo account says one sentence to Alfred: "Dispatch the four jobs on the "Checkout page redesign" card."

Alfred reads the rule, splits the work into child cards and dispatches it himself. Here is what that real run produced:

| Job on the child card | Dispatched to | CLI |
|---|---|---|
| New layout and interaction draft | designer | claude-fable |
| Build the form and its validation | coder | claude-opus |
| Fix the typo in the button label | coder | claude-haiku |
| Review before merge | reviewer | claude-opus |
| Second-opinion review | reviewer | codex |

The last row is a card Alfred added on his own, because the rule says to have codex take a look at code review as well. Each child card got its own session; with Alfred's, that is six.

Every dispatch he sends names one CLI next to the agent mention:

![Alfred's dispatch on a child card: @designer followed by @claude-fable](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/05-dispatch-names-cli.jpg)

And the session starts with exactly that command. Open the designer's session and the Command shows `--model fable`:

![The designer's session running, with --model fable in the launch command](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/06-session-command.jpg)

If your Alfred mentions the agent but no CLI, the session starts on that agent's default. Add one line to Alfred's prompt, "When you dispatch, put the CLI that the model-choice rule in Global Instructions calls for next to the agent mention", and his dispatches will carry it from then on.

## When you want to choose, it's one switch

Sometimes you want to pick it yourself. When you dispatch, switch the CLI in the dropdown above the input box, say claude-haiku for the coder on a typo fix.

It applies to that one message only. The agent's default stays as it is, and the next message goes back to its usual CLI.

![The CLI dropdown above the input: claude-haiku selected, with the footer "For this message only. coder's own defaults are set under Manage coder."](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/07-per-message-cli.jpg)

## Set it up yourself: three steps

1. **Add each model as a CLI.** One row per model under Agent CLI in settings, with the model in the command.
2. **Give each agent a default.** "Runs with" in the agent's edit form.
3. **Write a model-choice rule in Global Instructions.** Say which kind of job gets which CLI, then hand the work to Alfred with one sentence: "Dispatch these."

You don't have to click through these yourself either. Tell your agent the split you want, let it do the setup, and adjust it with the agent in conversation until it fits.

[udctl.com](https://udctl.com)
