/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem, SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Represents a fixed set of sorting strategies.
 */
enum Strategy {
    TOP_DOWN,
    BOTTOM_UP
}

/**
 * A mergesort sorting algorithm implementation.
 */
class MergeSort extends EventTarget implements SortingAlgorithm {
    /**
     * Desired sorting strategy.
     */
    private readonly strategy: Strategy;

    /**
     * Buffer used to temporarily hold items being sorted.
     */
    private buffer!: Array<SortableItem>;

    /**
     * Create a new sorting algorithm instance.
     *
     * @param strategy - Desired sorting strategy.
     */
    public constructor(strategy: Strategy) {
        super();

        this.strategy = strategy;
    }

    /** {@inheritDoc} */
    public sort(items: Array<SortableItem>): void {
        this.buffer = Array.from({length: items.length});

        switch (this.strategy) {
            case Strategy.TOP_DOWN:
                this.sortTopDown(items, 0, items.length - 1);
                break;
            case Strategy.BOTTOM_UP:
                this.sortBottomUp(items);
                break;
        }
    }

    /**
     * Sort given items using the top-down strategy.
     *
     * @param items - Arbitrary list of items.
     * @param low - Lowest index to process.
     * @param high - Highest index to process.
     */
    private sortTopDown(items: Array<SortableItem>, low: number, high: number): void {
        if (high <= low) {
            return;
        }

        const mid = low + Math.trunc((high - low) / 2);

        this.sortTopDown(items, low, mid);
        this.sortTopDown(items, mid + 1, high);
        this.merge(items, low, mid, high);
    }

    /**
     * Sort given items using the bottom-up strategy.
     *
     * @param items - Arbitrary list of items.
     */
    private sortBottomUp(items: Array<SortableItem>): void {
        for (let length = 1; length < items.length; length *= 2) {
            for (let low = 0; low < items.length - length; low += length + length) {
                this.merge(items, low, low + length - 1, Math.min(low + length + length - 1, items.length - 1));
            }
        }
    }

    /**
     * Merge items from buffer into given item list.
     *
     * @param items - Arbitrary list of items.
     * @param low - Lowest index to process.
     * @param mid - Pivot index.
     * @param high - Highest index to process.
     */
    private merge(items: Array<SortableItem>, low: number, mid: number, high: number): void {
        let i = low;
        let j = mid + 1;

        for (let k = low; k <= high; k++) {
            this.buffer[k] = items[k]!;
        }

        for (let k = low; k <= high; k++) {
            switch (true) {
                case i > mid:
                    items[k] = this.buffer[j++]!;
                    break;
                case j > high:
                    items[k] = this.buffer[i++]!;
                    break;
                case this.buffer[j]!.value < this.buffer[i]!.value:
                    this.dispatchEvent(new CustomEvent("compare", {detail: [this.buffer[j], this.buffer[i]]}));
                    items[k] = this.buffer[j++]!;
                    break;
                default:
                    items[k] = this.buffer[i++]!;
            }
        }

        this.dispatchEvent(new CustomEvent("change", {detail: items}));
    }
}

export default MergeSort;
export { Strategy };
