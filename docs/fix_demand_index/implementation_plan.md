# Fix Demand Index Implementation Plan

## Problem
The user reports "dependの表示治ってないです" (The display of depend [Demand Index] is not fixed). This implies the Demand Index feature is not showing up on Discogs release pages.

## Analysis
The current implementation in `src/content/demand-index/index.ts` relies on specific CSS classes:
- `.statistics .section_content`
- OR looking for text content "Have:" and "Want:" inside `div`s.

Discogs frequently updates their DOM structure. It is likely the selectors are outdated or the text content matching is too brittle.

## Proposed Strategy
1. **Improve Selector Robustness**:
    - Instead of relying solely on `.statistics`, look for the container that *specifically* holds the Have/Want numbers.
    - Discogs often uses `<section>` or `<div id="release-stats">` (hypothetical, needs verification if possible, but I can't browse).
    - The "text content" search `return text.includes('Have:') && text.includes('Want:')` is a good fallback, but `div.textContent` includes *all* descendants. This might return the `body` or a main wrapper `div` first if not careful, although the `found` logic tries to find `div`s.
    - The current `allDivs.find` will return the *first* match. `querySelectorAll('div')` returns nodes in document order. The `body` or outer wrapper will be first. **This is a bug.**
    - `div.textContent` of a wrapper contains "Have:" and "Want:" from its children.
    - We need the *innermost* container or the specific `ul` / `li` elements.

2. **Fixing the `allDivs.find` Logic**:
    - Instead of finding the *first* div that contains the text, we should find the *deepest* one, or one that has a specific structure (e.g., contains `li`s or `a` tags with these numbers).
    - Alternatively, search for the "Have:" label directly.

3. **Updated Algorithm**:
    - Find all elements containing "Have:" (e.g., `a` tags, `span`s, or text nodes).
    - Traverse up to find the common container for "Have:" and "Want:".
    - Use that container to inject the Demand Index.

4. **Version Bump**: v0.1.2.

## Code Changes
- Modify `src/content/demand-index/index.ts` to implement the "Find by text interactively" strategy better.
- Update `package.json` to v0.1.2.
