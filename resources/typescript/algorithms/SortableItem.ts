/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Represents a sortable item.
 */
interface SortableItem {
    /**
     * Unique identifier.
     */
    id: string;

    /**
     * Numeric value.
     */
    value: number;
}

export default SortableItem;
