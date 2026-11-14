#!/usr/bin/env python3
"""Lists every name your Voyage world uses for two different kinds of record (a trait and an item called "Katana", a quest
and a story start with one title, and so on). Voyage's 2026-11-14 update fixed mix-ups between records that share a name;
giving each one its own name keeps your world clear of that whole class of problem.

Use: export your world from Studio (the JSON editor's export or Download), then run
    python3 shared_names_check.py "My World.json"
It only reads the file. Case and spaces at the ends are ignored, the way a name is easy to mix up."""
import json
import sys

KINDS = {"traits": "trait", "abilities": "ability", "itemTypes": "item", "quests": "quest", "storyStarts": "story start",
         "npcs": "NPC", "locations": "location"}


def names(section):
    out = {}
    for key, rec in (section or {}).items():
        for n in (key, rec.get("name") if isinstance(rec, dict) else None):
            if isinstance(n, str) and n.strip():
                out.setdefault(n.strip().casefold(), set()).add(n.strip())
    return out


def main(path):
    world = json.loads(open(path, encoding="utf-8-sig").read())
    world = world.get("world", world)
    world = world.get("initialGameState", world)
    seen = {}
    for sec, kind in KINDS.items():
        for folded, spelt in names(world.get(sec)).items():
            seen.setdefault(folded, []).append((kind, sorted(spelt)[0]))
    clashes = {k: v for k, v in seen.items() if len({kind for kind, _ in v}) > 1}
    if not clashes:
        print("No shared names. Nothing to fix.")
        return 0
    with_trait = [v for v in clashes.values() if any(kind == "trait" for kind, _ in v)]
    print(f"{len(clashes)} names are used by more than one kind of record ({len(with_trait)} of them involve a trait):")
    for v in sorted(clashes.values(), key=lambda v: (not any(k == "trait" for k, _ in v), v[0][1].casefold())):
        print("  " + v[0][1] + ": " + ", ".join(kind for kind, _ in v))
    return 1


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
