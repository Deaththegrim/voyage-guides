# Dreamer's Voyage Workshop, S6E47: Living NPCs, in depth

`living-cast.json` is the Living Cast trigger from this episode, as Voyage stores it. `living_cast.js` is the same script on its own,
easier to read and edit.

What it does: every few turns (3 by default), one NPC in the scene does something of their own toward what they want, without
anyone asking: a move, an offer, a demand, a lie, a favour, walking off. It picks a different NPC each time (whoever has waited
longest, never the same one twice running while anyone else is there), stays out of fights (NPC Intents runs those) and out of the
first two turns. It asks the AI nothing on its own: no AI-judged condition, so it costs none of your per-turn checks.

To use it:
1. Open a test world in Voyage Studio, go to Mechanics > Advanced > Triggers, switch to the JSON view and paste `living_cast` into the
   triggers object.
2. In its script, change `GAP` (turns between nudges) and `WANTS`: one line per NPC saying what they are after right now. The two
   lines in there are the Workshop's (Old Marla and Lucius Gilt); swap them for your own people. Anyone not listed acts from their own
   record, so write their Hidden info as what they want and what they're hiding.
3. Save Draft and play a few turns. Use a test world, not one people play.

It keeps its memory in storage under `livingCast`; every trigger shares one storage, so don't use that name for anything else.
