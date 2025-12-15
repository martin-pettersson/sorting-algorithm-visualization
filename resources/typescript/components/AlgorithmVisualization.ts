/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Component } from "@martin-pettersson/sorting-algorithms/components/index.js";
import type { SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Provides a visual representation of sorting algorithms.
 */
interface AlgorithmVisualization extends Component, EventTarget {
    /**
     * Use given algorithm to sort items.
     *
     * @param algorithm - Arbitrary sorting algorithm.
     */
    useAlgorithm(algorithm: SortingAlgorithm): void;

    /**
     * Use given item count to visualize sorting algorithm.
     *
     * @param count - Arbitrary item count.
     */
    useItemCount(count: number): void;

    /**
     * Use given step timing.
     *
     * @param milliseconds - Number of milliseconds per step.
     */
    useStepTiming(milliseconds: number): void;

    /**
     * Control whether to visualize comparisons.
     *
     * @param shouldVisualize - Whether to visualize comparisons.
     */
    visualizeComparisons(shouldVisualize: boolean): void;

    /**
     * Scramble items.
     *
     * @param seed - Seed used to initialize random number generator.
     */
    scramble(seed?: number): void;

    /**
     * Start visualization.
     */
    start(): void;

    /**
     * Stop visualization.
     */
    stop(): void;

    /**
     * Reset visualization.
     */
    reset(): void;
}

export default AlgorithmVisualization;
