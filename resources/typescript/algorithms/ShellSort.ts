/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem, SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * A shellsort sorting algorithm implementation.
 */
class ShellSort extends EventTarget implements SortingAlgorithm {
    /** {@inheritDoc} */
    public sort(items: Array<SortableItem>): void {
        let h = 1;

        while (h < Math.trunc(items.length / 3)) {
            h = h * 3 + 1;
        }

        while (h >= 1) {
            for (let i = h; i < items.length; i++) {
                for (let j = i; j >= h && items[j]!.value < items[j - h]!.value; j -= h) {
                    this.dispatchEvent(new CustomEvent("compare", {detail: [items[j], items[j - h]]}));
                    [items[j], items[j - h]] = [items[j - h]!, items[j]!];
                    this.dispatchEvent(new CustomEvent("change", {detail: items}));
                }
            }

            h = Math.trunc(h / 3);
        }
    }
}

export default ShellSort;
