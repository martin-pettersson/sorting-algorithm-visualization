/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
    InsertionSort,
    MergeSort,
    MergeSortStrategy,
    QuickSort,
    QuickSortStrategy,
    SelectionSort,
    ShellSort,
    SortingAlgorithmRegistry
} from "@martin-pettersson/sorting-algorithms/algorithms/index.js";
import type { ApplicationBuilder, ServiceProvider } from "@n7e/framework";

/**
 * Provides sorting algorithms.
 */
class SortingAlgorithmProvider implements ServiceProvider {
    /**
     * Registered sorting algorithms.
     */
    private readonly algorithms: SortingAlgorithmRegistry = new SortingAlgorithmRegistry();

    /** {@inheritDoc} */
    public configure(applicationBuilder: ApplicationBuilder): void {
        applicationBuilder.register("sortingAlgorithmRegistry", () => this.algorithms);

        this.algorithms.register("selection", new SelectionSort());
        this.algorithms.register("insertion", new InsertionSort());
        this.algorithms.register("shell", new ShellSort());
        this.algorithms.register("merge-top-down", new MergeSort(MergeSortStrategy.TOP_DOWN));
        this.algorithms.register("merge-bottom-up", new MergeSort(MergeSortStrategy.BOTTOM_UP));
        this.algorithms.register("quick-two-way-partitioning", new QuickSort(QuickSortStrategy.TWO_WAY_PARTITIONING));
        this.algorithms.register(
            "quick-three-way-partitioning",
            new QuickSort(QuickSortStrategy.THREE_WAY_PARTITIONING)
        );
    }
}

export default SortingAlgorithmProvider;
