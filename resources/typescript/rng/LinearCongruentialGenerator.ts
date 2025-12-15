/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RandomNumberGenerator } from "@martin-pettersson/sorting-algorithms/rng/index.js";

/**
 * A linear congruential generator implementation of a random number generator.
 */
class LinearCongruentialGenerator implements RandomNumberGenerator {
    /**
     * Modulus used in recurrence relation equation.
     */
    private readonly modulus: number;

    /**
     * Multiplier used in recurrence relation equation.
     */
    private readonly multiplier: number;

    /**
     * Increment used in recurrence relation equation.
     */
    private readonly increment: number;

    /**
     * Initial seed to generate numbers from.
     */
    private initialSeed: number;

    /**
     * Current iteration seed.
     */
    private currentSeed: number;

    /**
     * Create a new random generator instance.
     *
     * @param initialSeed - Initial seed.
     * @param modulus - Modulus used in recurrence relation equation.
     * @param multiplier - Multiplier used in recurrence relation equation.
     * @param increment - Increment used in recurrence relation equation.
     */
    public constructor(
        initialSeed: number = Date.now(),
        modulus: number = 2 ** 16 + 1,
        multiplier: number = 1103515245,
        increment: number = 12345
    ) {
        this.modulus = modulus;
        this.multiplier = multiplier;
        this.increment = increment;
        this.initialSeed = initialSeed;
        this.currentSeed = initialSeed;
    }

    /** {@inheritDoc} */
    public use(seed: number): void {
        this.initialSeed = seed;

        this.reset();
    }

    /** {@inheritDoc} */
    public reset(): void {
        this.currentSeed = this.initialSeed;
    }

    /** {@inheritDoc} */
    public next(): number {
        this.currentSeed = (this.currentSeed * this.multiplier + this.increment) % this.modulus;

        return this.currentSeed / this.modulus;
    }
}

export default LinearCongruentialGenerator;
