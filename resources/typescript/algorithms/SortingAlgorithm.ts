/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Represents an algorithm used for sorting lists of items.
 */
interface SortingAlgorithm extends EventTarget {
    /**
     * Sort given items in place.
     *
     * @param items - Arbitrary list of items.
     */
    sort(items: Array<SortableItem>): void;
}

export default SortingAlgorithm;
