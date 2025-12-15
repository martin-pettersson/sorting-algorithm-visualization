/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortableItem, SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Represents a fixed set of partitioning strategies.
 */
enum Strategy {
    TWO_WAY_PARTITIONING,
    THREE_WAY_PARTITIONING
}

/**
 * A quicksort sorting algorithm implementation.
 */
class QuickSort extends EventTarget implements SortingAlgorithm {
    /**
     * Desired partitioning strategy.
     */
    private readonly strategy: Strategy;

    /**
     * Create a new sorting algorithm instance.
     *
     * @param strategy - Desired partitioning strategy.
     */
    public constructor(strategy: Strategy) {
        super();

        this.strategy = strategy;
    }

    /** {@inheritDoc} */
    public sort(items: Array<SortableItem>): void {
        switch (this.strategy) {
            case Strategy.TWO_WAY_PARTITIONING:
                this.sortTwoWay(items, 0, items.length - 1);
                break;
            case Strategy.THREE_WAY_PARTITIONING:
                this.sortThreeWay(items, 0, items.length - 1);
                break;
        }
    }

    /**
     * Sort given items using two-way partitioning.
     *
     * @param items - Arbitrary list of items.
     * @param low - Lowest index to process.
     * @param high - Highest index to process.
     */
    private sortTwoWay(items: Array<SortableItem>, low: number, high: number): void {
        if (high <= low) {
            return;
        }

        const j = this.partition(items, low, high);

        this.sortTwoWay(items, low, j - 1);
        this.sortTwoWay(items, j + 1, high);

        this.dispatchEvent(new CustomEvent("change", {detail: items}));
    }

    /**
     * Sort given items using three-way partitioning.
     *
     * @param items - Arbitrary list of items.
     * @param low - Lowest index to process.
     * @param high - Highest index to process.
     */
    private sortThreeWay(items: Array<SortableItem>, low: number, high: number): void {
        if (high <= low) {
            return;
        }

        const item = items[low]!;
        let lessThan = low;
        let greaterThan = high;
        let i = low + 1;

        while (i <= greaterThan) {
            this.dispatchEvent(new CustomEvent("compare", {detail: [items[i], item]}));

            switch (true) {
                case items[i]!.value < item.value:
                    [items[lessThan], items[i]] = [items[i]!, items[lessThan]!];
                    this.dispatchEvent(new CustomEvent("change", {detail: items}));

                    lessThan++;
                    i++;
                    break;
                case items[i]!.value > item.value:
                    [items[i], items[greaterThan]] = [items[greaterThan]!, items[i]!];
                    this.dispatchEvent(new CustomEvent("change", {detail: items}));

                    greaterThan--;
                    break;
                default:
                    i++;
            }
        }

        this.sortThreeWay(items, low, lessThan - 1);
        this.sortThreeWay(items, greaterThan + 1, high);
    }

    /**
     * Partition given items.
     *
     * @param items - Arbitrary list of items.
     * @param low - Lowest index to process.
     * @param high - Highest index to process.
     * @returns Pivot index.
     */
    private partition(items: Array<SortableItem>, low: number, high: number): number {
        const item = items[low]!;
        let i = low;
        let j = high + 1;

        while (true) {
            while (items[++i]!.value < item.value) {
                this.dispatchEvent(new CustomEvent("compare", {detail: [items[i], item]}));

                if (i === high) {
                    break;
                }
            }

            while (item.value < items[--j]!.value) {
                this.dispatchEvent(new CustomEvent("compare", {detail: [item, items[j]]}));

                if (j === low) {
                    break;
                }
            }

            if (i >= j) {
                break;
            }

            [items[i], items[j]] = [items[j]!, items[i]!];
            this.dispatchEvent(new CustomEvent("change", {detail: items}));
        }

        [items[low], items[j]] = [items[j]!, items[low]!];
        this.dispatchEvent(new CustomEvent("change", {detail: items}));

        return j;
    }
}

export default QuickSort;
export { Strategy };
