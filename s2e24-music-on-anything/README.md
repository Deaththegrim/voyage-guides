# Music on anything (the simple version)

This is how I give a city, a person, a boss fight or a creator screen its own music in Voyage. You don't need to code. It's a bit of copy and paste in Studio's JSON editor.

## Step 1: make a "track family"

A track family is just a named playlist. You give it a name and one or more songs (each one a link to an mp3).

```json
"gameplayMusicSettings": {
  "tracks": {
    "WarrenTheme": {
      "variants": [
        { "url": "https://you.github.io/my-music/warren-1.mp3" },
        { "url": "https://you.github.io/my-music/warren-2.mp3" }
      ]
    }
  }
}
```

- The name (`WarrenTheme`) is how everything else finds it. Pick it once and leave it.
- Links must start with `https://`. A free GitHub Pages site works as a host; that's what I use.
- Up to 12 songs per family.

## Step 2: decide how it starts playing

There are only two ways.

### Way A: let Voyage pick it

Add one line to the family and Voyage plays it at the right moment by itself.

- For a moment: `"cues": ["combat"]`. Moments you can use: `character-creation`, `combat`, `travel`, `near-death`, `dying`, `dead`, `recovery`.
- For a mood: `"matchTags": ["ominous", "storm"]`. Voyage plays it when the scene feels like those words.
- For the character creator: set `"characterCreationTrackId": "YourFamilyName"` in the same section.

Easiest win: Voyage's own mood families (Calm, Apprehensive, Triumphant and so on) already have their mood words. Swap their songs for yours and your whole world sounds like you, with nothing else to do.

### Way B: switch it on with a trigger

This is how you put music on ONE thing: a place, a person, a quest, an item. You need two triggers:

- **ON:** "when the party is in The Warren and the music isn't on yet → play WarrenTheme, remember it's on"
- **OFF:** "when the music is on and the party has left The Warren → stop it, remember it's off"

Here's the ON trigger:

```json
"music_warren_on": {
  "name": "music_warren_on", "recurring": true,
  "conditions": [
    { "type": "party-region", "operator": "equals", "value": "The Warren" },
    { "type": "read-boolean", "key": "music_warren", "operator": "equals", "value": false }
  ],
  "effects": [
    { "type": "music-track-set", "trackId": "WarrenTheme" },
    { "type": "write-boolean", "key": "music_warren", "operator": "set", "value": true }
  ]
}
```

And the OFF trigger is the mirror image:

```json
"music_warren_off": {
  "name": "music_warren_off", "recurring": true,
  "conditions": [
    { "type": "read-boolean", "key": "music_warren", "operator": "equals", "value": true },
    { "type": "party-region", "operator": "notEquals", "value": "The Warren" }
  ],
  "effects": [
    { "type": "music-track-clear" },
    { "type": "write-boolean", "key": "music_warren", "operator": "set", "value": false }
  ]
}
```

`music_warren` is just a note to yourself ("is it on?"). Use a different one for every song you switch on.

## Step 3: swap "where" for anything

Change the first condition of the ON trigger and the music follows something else. Flip it for the OFF trigger.

- **A city or region:** `party-region` is the region's name
- **One building or place:** `party-location` is the place's name (one name only, not a list)
- **One room in a place:** `party-area`
- **A person:** `npc-in-scene` with `"npc": "Their Name"` and `"value": true` (OFF uses `false`)
- **Someone carrying an item:** `player-item`, with `"item"` set to the item's key and `"value": 1` using `greaterThanOrEqual`
- **A curse or transformation:** `player-traits` contains the trait's name
- **Night time:** `time-of-day`
- **A quest finishing:** put the `music-track-set` effect in the quest's own completion effects for a payoff song, then clear it on a later trigger

## Three things to remember

1. **Always have an OFF.** Switched-on music never stops by itself. It even keeps playing through fights and death until something clears it.
2. **Only one at a time.** Switching on a second song replaces the first, and any OFF stops whatever is playing. Don't let two places' music overlap.
3. **Want normal fight music in your city?** Add a third trigger: when the music is on and a fight starts (`npc-in-combat`, `anySceneNPC`, `true`), run the same two effects as OFF. When the fight ends, your ON trigger switches it back on by itself.

## Ready to paste

`examples.json` in this folder has 7 playlists and 11 triggers, all done for you:
- a city with ON, OFF and the fight hand-off
- a person's theme
- music while someone carries an item
- music while someone has a trait
- night music
- one battle playlist and one mood playlist that Voyage picks by itself

I ran every one through Voyage's own validator inside a real world. It passed at draft and at publish with no warnings. I also checked that the validator catches a wrong playlist name or an `http://` link, so a clean result means something.

How to use it:
1. Open your world in Studio's JSON editor.
2. Find `"gameplayMusicSettings"`, then `"tracks"`. Paste the playlists you want inside it, next to the ones already there. Mind the commas between entries.
3. Find `"triggers"` (newer Studio exports call it `"triggerDefinitions"`) and paste the triggers you want inside it.
4. Change the names to yours: the playlist name, your song links, and the place, person, item or trait each trigger watches. The trigger's outer key and its `"name"` must stay the same as each other.
5. Save. If Studio warns "references missing ...", a name doesn't match your world exactly.

Here's each "where" on its own, so you can see the only line that changes. The OFF trigger uses the opposite.

```json
{ "type": "npc-in-scene", "npc": "Bram Tolliver", "operator": "equals", "value": true }
```
```json
{ "type": "player-item", "item": "Comm Bead", "operator": "greaterThanOrEqual", "value": 1 }
```
```json
{ "type": "player-traits", "operator": "contains", "value": "Took It" }
```
```json
{ "type": "time-of-day", "operator": "regex", "value": "^(night|midnight)$" }
```

(Bram Tolliver, Comm Bead and Took It are from my Long Thaw. Put your own names there.)

That's it. Every city, boss arena and creator screen in my worlds runs on these three steps.

My worlds and lorebooks: https://deaththegrim.github.io/
