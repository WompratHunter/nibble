# Nibble

Nibble turns short vertical cooking videos into written recipes and collects them into each cook's personal cookbook.

## Language

### People

**Creator**:
A user who has uploaded at least one Video. Every Creator is a User; the term is used when talking about authorship.
_Avoid_: Author, chef, poster

**User**:
Anyone with a Nibble account.
_Avoid_: Account, member, profile

### Content

**Video**:
A short vertical clip of someone cooking, uploaded by a Creator. Moves through the Video lifecycle.
_Avoid_: Reel, clip, post

**Video lifecycle**:
The states a Video passes through: awaiting upload, processing, ready, or failed. Only ready Videos are visible to others.
_Avoid_: Upload status, job state

**Cooking notes**:
Optional free text a Creator adds when uploading, to help recipe generation (amounts, temperatures, substitutions).
_Avoid_: Caption, transcript

**Recipe**:
The written, structured version of a Video: title, ingredients, ordered steps, servings and times. Exactly one per ready Video.
_Avoid_: Card, instructions

**Recipe generation**:
Producing a Recipe from a Video and its Cooking notes. Happens automatically during processing.
_Avoid_: Transcription, extraction, AI parsing

**Ingredient**:
One line of a Recipe's ingredient list: a name, a quantity and an optional unit.

**Step**:
One numbered instruction in a Recipe, optionally with a duration.
_Avoid_: Instruction, direction

### Discovery and collection

**Feed**:
The vertical, swipeable stream of ready Videos, newest first.
_Avoid_: Timeline, home, stream

**Cookbook**:
A User's personal collection of Recipes: those they authored plus those they saved.
_Avoid_: Library, favourites, collection

**Save**:
Adding another Creator's Recipe to your Cookbook. Unsave removes it.
_Avoid_: Bookmark, favourite, like

**Like**:
A lightweight reaction to a Video. Reserved in the contract; not yet a feature. Distinct from Save.
