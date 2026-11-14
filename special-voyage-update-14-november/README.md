# Voyage update 2026-11-14: what to check in your world

I went through the 14 November patch notes against my own published worlds and mods. Most of it is nothing you have to touch. These are the parts that can matter to a world you've built, what to look for, and where you fix it.

Short version: check your names (section 1). Everything else is optional, or only matters if you rely on that thing.

## 1. Records that share a name (check this one)

What changed: Voyage fixed "several issues where traits, abilities, items, quests, openings, NPCs, or map locations that share a name could be mixed up". So Voyage now has to tell apart two records that carry the same name. A trait called Katana that gives you an item called Katana is the common case. So is a quest with the same title as the trait it rewards, or an ability named after the trait that grants it.

Why bother: one record per name takes the whole problem away, and you don't have to guess how Voyage resolves it. I've renamed these in all my published worlds. If your players hit "Your selected traits are not available for this story start" when they finish making a character, that isn't your names: it's an old saved character made before the update. Have them make a fresh one.

How to find them:
- Easiest: export your world JSON from Studio and run the checker in this folder: `python3 shared_names_check.py "Your World.json"`. It only reads the file. It lists every name used by two kinds of record, with the trait ones first.
- No Python: take each trait name on your creator pages and type it into Studio's file tree search box. If an item, ability, quest, story start, NPC or location with the same name comes up, that's a shared name.

Where to fix it, in Studio:
- Rename ONE side, not both. I kept the side the player sees most and renamed the other. My creator picks got the new name (Katana Bearer gives you the Katana; Loader Frame Pilot gives you the Loader Frame), so the item, inventory and story all still say Katana.
- After renaming a trait, fix everything that names it. Studio does not do it for you:
  - its creator category (Content, then the category's trait list)
  - any other trait's unlockedBy / excludedBy
  - premade characters' trait lists
  - the level-up trait pool
  - abilities whose requirement names the trait
  - triggers: player-traits conditions and effects, and any script that writes the name in quotes
- After renaming an item, fix the item's key everywhere it's named: trait startingItems, story start startingItems, triggers with player-item / item-add / item-remove, and your aiInstructions if they name it (prices, shop lines).
- After renaming a quest, ability or NPC, check the triggers that name it (quest-init, quest-accept, npc-in-scene and so on).
- Then paste or save and read Studio's warnings: "references missing ..." means something still points at the old name.

Good to know: a rename reaches new games only. Saves keep playing the version they were started on.

## 2. Card description has a shorter limit

Studio now calls the short world summary "Card description" and the long formatted text "Description". The card description got a shorter limit for new or edited text: **260 characters**. Voyage's notes don't give the number, but Studio's Publish tab shows a 0/260 counter under the box. Existing long ones are kept until you edit them, so nothing breaks today. If you edit it and Studio refuses the save, trim the card description to 260 first.

Where: the Publish tab in Studio, the Card description box under World name.

## 3. Learned ability tiers (optional)

New in Combat Settings: tiers for the abilities characters learn during play. The AI puts each newly learned ability into a tier, and that tier fixes its skill-check bonus and cooldown. Players see the tier, bonus and cooldown on the ability. You also get how often abilities are learned (abilityLearningInterval, in turns).

You don't have to set anything. If you do, the rules are:
- 1 to 10 tiers, each with a unique id and a unique name
- bonus 0 to 25; cooldown a whole number of turns, 0 or more
- optional guidance per tier (up to 2,000 characters), telling the AI what belongs there
- once you set tiers you must also set the default tier, the one the AI uses when it isn't sure

Worth doing if your aiInstructions already try to hand out "small" vs "big" learned moves in words. A tier does that mechanically.

Where: Studio, Combat Settings (JSON: combatSettings.abilityTiers, defaultTierId, abilityLearningInterval).

## 4. Moving locations (optional)

New trigger effect: location-move. It moves a location on the map (x / y, set or add) or into another region. It's made for things like a travelling ship. A location-move with none of x, y or region is refused when you save.

Where: any trigger, quest or narrative event completion effect.

## 5. Things that moved or changed on their own

- Name Filter Settings moved to Content, then Characters.
- Studio's file tree now groups traits under their categories, and there's an expand/collapse-all button next to the search box.
- Travel updates and narration no longer give distances in kilometres. If your world's instructions ask the narrator to quote km for a journey, expect it to stop.
- In Voyage mode, items, stats and rewards the AI hands out now stay "within the world's scale", and a cut reward is marked "(capped)". If your world is built around big numbers handed out by the story, watch for "(capped)" in play. Voyage hasn't said what sets the scale.
- Character voices are more evenly paced: the fastest slow down a little and the slowest speed up a little. If you hand-tuned voice speeds, give them a listen.
- Characters with no creator voice no longer all share the narrator's voices. Existing saves keep theirs.
- Undoing a turn no longer breaks ability requirements or trigger and quest rewards on a repeated action.

## 6. Creator API (only if you use it)

New endpoints: world analytics (daily, session depth, sources), shared player feedback (now tagged with the environment it came from), item image generation (spends Usage), and a confirm step for upgrading an older world to the current engine version (version-upgrade).

My worlds and lorebooks: https://deaththegrim.github.io/
