/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Represents a comparison operation.
 */
type ComparisonOperation = {
    type: "comparison",
    detail: [SortableItem, SortableItem]
};

/**
 * Represents a change operation.
 */
type ChangeOperation = {
    type: "change",
    detail: Array<SortableItem>
};

type SortingOperation = ComparisonOperation | ChangeOperation;

export default SortingOperation;
