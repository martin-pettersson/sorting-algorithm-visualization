/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem, SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * A selection sort sorting algorithm implementation.
 */
class SelectionSort extends EventTarget implements SortingAlgorithm {
    /** {@inheritDoc} */
    public sort(items: Array<SortableItem>): void {
        for (let i = 0; i < items.length; i++) {
            let min = i;

            for (let j = i + 1; j < items.length; j++) {
                this.dispatchEvent(new CustomEvent("compare", {detail: [items[j], items[min]]}));

                if (items[j]!.value < items[min]!.value) {
                    min = j;
                }
            }

            [items[i], items[min]] = [items[min]!, items[i]!];
            this.dispatchEvent(new CustomEvent("change", {detail: items}));
        }
    }
}

export default SelectionSort;
