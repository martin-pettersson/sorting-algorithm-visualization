/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SortingAlgorithm } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Represents a fixed set of registered sorting algorithms.
 */
class SortingAlgorithmRegistry {
    /**
     * Registered sorting algorithms.
     */
    private readonly algorithms: Map<string, SortingAlgorithm> = new Map();

    /**
     * Register sorting algorithm for a given identifier.
     *
     * @param identifier - Arbitrary identifier.
     * @param algorithm - Associated sorting algorithm.
     */
    public register(identifier: string, algorithm: SortingAlgorithm): void {
        if (this.algorithms.has(identifier)) {
            throw new Error(`An algorithm with the given identifier already exists: ${identifier}`);
        }

        this.algorithms.set(identifier, algorithm);
    }

    /**
     * Produce a sorting algorithm for a given identifier.
     *
     * @param identifier - Arbitrary identifier.
     * @returns Associated sorting algorithm.
     */
    public use(identifier: string): SortingAlgorithm {
        if (!this.algorithms.has(identifier)) {
            throw new Error(`No algorithm with the given identifier exists: ${identifier}`);
        }

        return this.algorithms.get(identifier)!;
    }
}

export default SortingAlgorithmRegistry;
