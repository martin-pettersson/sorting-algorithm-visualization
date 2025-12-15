/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Has the ability to generate pseudo random number sequences.
 */
interface RandomNumberGenerator {
    /**
     * Configure generator to use a given seed.
     *
     * @param seed - Arbitrary generator seed.
     */
    use(seed: number): void;

    /**
     * Reset the generator.
     *
     * This sets up the generator to start from the beginning of the sequence
     * with the current seed.
     */
    reset(): void;

    /**
     * Generate next number in the sequence according to the current seed.
     */
    next(): number;
}

export default RandomNumberGenerator;
