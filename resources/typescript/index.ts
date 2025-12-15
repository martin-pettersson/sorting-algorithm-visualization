/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Waits for a given amount of milliseconds.
 *
 * @param milliseconds - Arbitrary delay.
 * @param signal - Abort signal used to resolve the timeout early if needed.
 * @returns Promise resolving when the timer runs out or the given signal is aborted.
 */
async function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
    let timer!: number;

    try {
        await new Promise(resolve => {
            signal.addEventListener("abort", () => resolve(void 0));
            timer = setTimeout(resolve, milliseconds);
        });
    } finally {
        clearTimeout(timer);
    }
}

export { wait };
