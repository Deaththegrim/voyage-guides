// Living Cast: every few turns, one NPC in the scene does something of their own, without being asked.
// Paste-ready trigger script for Voyage (a Dreamer's Voyage Workshop download). Change GAP and WANTS for your world.
var GAP = 3;   // turns between nudges (one NPC acts at most every GAP turns)
var WANTS = {  // optional: one line per NPC, what they are after right now. NPCs not listed act from their own record.
  "Old Marla": "She wants to know who let Bramble out, so she watches people hard and asks the question nobody wants asked.",
  "Lucius Gilt": "He wants Dreamer's best act for his own show, and he will buy, bribe or embarrass his way to it."
};
function map(v) { return v && typeof v === 'object' ? v : {}; }
var tick = +check({type: 'game-tick'}) || 0;
var s = storage.livingCast;
if (!s || typeof s !== 'object') { s = {next: 0, last: '', seen: {}}; }
if (!s.seen || typeof s.seen !== 'object') { s.seen = {}; }
var scene = map(check({type: 'npc-in-scene', npc: 'anySceneNPC'}));
var fightRaw = check({type: 'npc-in-combat', npc: 'anySceneNPC'});
var fight = map(fightRaw);
var inFight = fightRaw === true || Object.keys(fight).some(function (n) { return fight[n]; });
var names = Object.keys(scene).filter(function (n) { return scene[n]; });
if (tick < 2 || tick < s.next || inFight || !names.length) {
  skip = true;
} else {
  names.sort(function (a, b) {
    var d = (s.seen[a] === undefined ? -1 : s.seen[a]) - (s.seen[b] === undefined ? -1 : s.seen[b]);
    return d || (a < b ? -1 : 1);
  });
  var who = (names[0] === s.last && names.length > 1) ? names[1] : names[0];
  effects.push({type: 'story', instruction: who + " doesn't wait to be asked this turn: they do one thing of their own toward what they want right now, " +
    "in character, something the scene can see (a move, an offer, a demand, a lie, a favour, walking off). " +
    (WANTS[who] || "Work out what from who they are, what they want and what they are hiding.") +
    " One beat only, then leave room for the player to answer it. In a calm scene keep it small."});
  s.seen[who] = tick;
  s.last = who;
  s.next = tick + GAP;
}
storage.livingCast = s;
