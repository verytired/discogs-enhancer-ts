# Fix Demand Index Implementation Plan (v0.1.3)

## Problem
v0.1.2 robust fix fails to extract numbers on the Live Site.
The Live Site structure is:
```html
<li>
    <span>Have:</span>
    <a href="...">3939</a>
</li>
```
My logic parses the `span` ("Have:") and gets 0.
The fallback logic (finding `li`s in `ul`) *should* work if `ul` is found correctly. The failure implies either:
1. `ul` is not found as the common parent.
2. The `li` text parsing fails.
3. The `li` selector fails.

## Strategy
1. **Improve Number Parsing**: Instead of relying on finding `li`s based on `includes('Have:')`, I should actively look for digits in the **Same Line** or **Parent Element** or **Siblings**.
2. **"Look Up" Strategy**: If parsing the element text yields 0, check `parentElement.textContent`.
   - `span` has "Have:". `parentElement` (`li`) has "Have: 3939".
   - `parseCount("Have: 3939")` -> 3939. Correct.

3. **Validation**: Create a regression test with the exact HTML structure observed.

## Changes
- Modify `src/content/demand-index/index.ts` to check `parentElement.textContent` if direct parsing fails.
- Add `Live Site Layout` test case to `src/content/demand-index/index.test.ts`.
