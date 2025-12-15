/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem, SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * An insertion sort sorting algorithm implementation.
 */
class InsertionSort extends EventTarget implements SortingAlgorithm {
    /** {@inheritDoc} */
    public sort(items: Array<SortableItem>): void {
        for (let i = 1; i < items.length; i++) {
            for (let j = i; j > 0 && items[j]!.value < items[j - 1]!.value; j--) {
                this.dispatchEvent(new CustomEvent("compare", {detail: [items[j], items[j - 1]]}));
                [items[j], items[j - 1]] = [items[j - 1]!, items[j]!];
                this.dispatchEvent(new CustomEvent("change", {detail: items}));
            }
        }
    }
}

export default InsertionSort;
