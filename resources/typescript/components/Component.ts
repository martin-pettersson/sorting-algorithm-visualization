/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Represents a visual component of the application.
 */
interface Component {
    /**
     * Set up the component with an associated HTML element.
     *
     * @param element - Associated HTML element.
     */
    setUp(element: HTMLElement): void;
}

export default Component;
