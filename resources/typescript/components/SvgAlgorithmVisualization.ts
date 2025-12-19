/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { wait } from "@martin-pettersson/sorting-algorithms";
import type { AlgorithmVisualization } from "@martin-pettersson/sorting-algorithms/components/index.js";
import type { RandomNumberGenerator } from "@n7e/rng";
import type {
    SortableItem,
    SortingAlgorithm,
    SortingOperation
} from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Provides a visual representation of sorting algorithms using SVG and CSS animations.
 */
class SvgAlgorithmVisualization extends EventTarget implements AlgorithmVisualization {
    /**
     * Class name used to indicate that a sortable item is being compared.
     */
    private static ITEM_COMPARED_CLASS_NAME = "sortable-item--compared";

    /**
     * Class name used to indicate that a sortable item is being moved.
     */
    private static ITEM_MOVED_CLASS_NAME = "sortable-item--moved";

    /**
     * Random number generator.
     */
    private readonly randomNumberGenerator: RandomNumberGenerator;

    /**
     * Visualized sorting algorithm.
     */
    private algorithm: SortingAlgorithm

    /**
     * Number of items to visualize.
     */
    private itemCount: number;

    /**
     * Number of milliseconds per step.
     */
    private stepTiming: number;

    /**
     * Whether to visualize comparisons.
     */
    private shouldVisualizeComparisons: boolean;

    /**
     * Sortable items to visualize.
     */
    private items: Array<SortableItem>;

    /**
     * Captured sorting operations.
     */
    private operations: Array<SortingOperation>;

    /**
     * Current sorting operation.
     */
    private lastOperation: number;

    /**
     * Last visualized state.
     */
    private lastState: Array<SortableItem>;

    /**
     * Visualization abort controller.
     */
    private visualizationController: AbortController;

    /**
     * Associated SVG element.
     */
    private element!: SVGSVGElement;

    /**
     * Sortable item bars.
     */
    private bars!: SVGGElement;

    /**
     * Create a new component instance.
     *
     * @param algorithm - Visualized sorting algorithm.
     * @param randomNumberGenerator - Random number generator.
     */
    public constructor(randomNumberGenerator: RandomNumberGenerator, algorithm: SortingAlgorithm) {
        super();

        this.randomNumberGenerator = randomNumberGenerator;
        this.algorithm = algorithm;
        this.itemCount = 0;
        this.stepTiming = 250;
        this.shouldVisualizeComparisons = false;
        this.items = [];
        this.operations = [];
        this.lastOperation = 0;
        this.lastState = this.items.slice();
        this.visualizationController = new AbortController();

        this.captureChangeOperation = this.captureChangeOperation.bind(this);
        this.captureComparisonOperation = this.captureComparisonOperation.bind(this);
    }

    /** {@inheritDoc} */
    public setUp(element: HTMLElement): void {
        if (!(element instanceof SVGSVGElement)) {
            throw new Error("SVG algorithm visualization expects an SVG element.");
        }

        this.element = element;
        this.bars = element.querySelector(".js-svg-algorithm-visualization__bars")!;

        this.reset();
    }

    /** {@inheritDoc} */
    public useAlgorithm(algorithm: SortingAlgorithm) {
        this.algorithm = algorithm;

        this.visualizationController.abort();
        this.captureOperations();
        this.resetVisualization();
    }

    /** {@inheritDoc} */
    public useItemCount(count: number) {
        this.itemCount = count;

        this.visualizationController.abort();
        this.generateItems();
        this.captureOperations();
        this.resetVisualization();
    }

    /** {@inheritDoc} */
    public useStepTiming(milliseconds: number): void {
        this.stepTiming = milliseconds;
    }

    /** {@inheritDoc} */
    public visualizeComparisons(shouldVisualize: boolean): void {
        this.shouldVisualizeComparisons = shouldVisualize;
    }

    /** {@inheritDoc} */
    public start(): void {
        if (!this.visualizationController.signal.aborted) {
            return;
        }

        if (this.lastOperation === this.operations.length) {
            this.resetVisualization();
        }

        this.visualizationController = new AbortController();
        this.visualizationController.signal.addEventListener("abort", () => this.dispatchEvent(new CustomEvent("stop")));

        this.dispatchEvent(new CustomEvent("start"));
        this.runVisualization(this.visualizationController.signal);
    }

    /** {@inheritDoc} */
    public stop(): void {
        this.visualizationController.abort();
    }

    /** {@inheritDoc} */
    public reset(): void {
        this.visualizationController.abort();
        this.resetVisualization();
    }

    /** {@inheritDoc} */
    public scramble(seed: number = Date.now()) {
        this.visualizationController.abort();
        this.randomNumberGenerator.use(seed);
        this.generateItems();
        this.captureOperations();
        this.resetVisualization();
    }

    /**
     * Reset visualization state to before the initial operation.
     */
    private resetVisualization(): void {
        this.lastOperation = 0;

        // Render on the next cycle to avoid a race condition.
        setTimeout(this.render.bind(this), 0, this.items);
    }

    /**
     * Generate sortable items "scrambled" by the current RNG seed.
     */
    private generateItems(): void {
        this.randomNumberGenerator.reset();

        this.items = Array.from({length: this.itemCount})
            .fill(0)
            .map((_, index) => ({
                id: crypto.randomUUID(),
                value: index + 1
            }));

        for (let i = 0; i < this.itemCount; i++) {
            const j = Math.floor(this.randomNumberGenerator.next() * this.itemCount);

            [this.items[i], this.items[j]] = [this.items[j]!, this.items[i]!];
        }
    }

    /**
     * Capture algorithm sorting operations.
     */
    private captureOperations(): void {
        this.operations = [];

        this.algorithm.addEventListener("change", this.captureChangeOperation);
        this.algorithm.addEventListener("compare", this.captureComparisonOperation);
        this.algorithm.sort(this.items.slice());
        this.algorithm.removeEventListener("change", this.captureChangeOperation);
        this.algorithm.removeEventListener("compare", this.captureComparisonOperation);
    }

    /**
     * Capture algorithm change operation.
     *
     * @param event - Change event triggering the action.
     */
    private captureChangeOperation(event: Event): void {
        this.operations.push({type: "change", detail: (event as CustomEvent<Array<SortableItem>>).detail.slice()});
    }

    /**
     * Capture algorithm comparison operation.
     *
     * @param event - Comparison event triggering the action.
     */
    private captureComparisonOperation(event: Event): void {
        this.operations.push({type: "comparison", detail: (event as CustomEvent<[SortableItem, SortableItem]>).detail});
    }

    /**
     * Run sorting algorithm visualization.
     *
     * @param signal - Signal indicating whether to abort visualization.
     * @returns Promise resolving when the visualization is complete or aborted.
     */
    private async runVisualization(signal: AbortSignal): Promise<void> {
        if (this.lastOperation === 0) {
            this.render(this.items);
            this.lastState = this.items.slice();

            await wait(this.stepTiming, signal);
        }

        while (this.lastOperation < this.operations.length && !signal.aborted) {
            const operation = this.operations[this.lastOperation++]!;

            switch (operation.type) {
                case "change":
                    await this.visualizeChange(this.lastState, operation.detail, signal);
                    this.render(operation.detail);
                    this.lastState = operation.detail;
                    break;
                case "comparison":
                    if (!this.shouldVisualizeComparisons) {
                        continue;
                    }

                    await this.visualizeComparison(operation.detail, signal);
                    break;
            }
        }

        if (this.lastOperation === this.operations.length) {
            this.visualizationController.abort();
        }
    }

    /**
     * Visualize a change operation.
     *
     * @param from - Previous state.
     * @param to - Current state.
     * @param signal - Signal indicating whether to abort visualization.
     * @returns Promise resolving when the visualization is complete or aborted.
     */
    private async visualizeChange(
        from: Array<SortableItem>,
        to: Array<SortableItem>,
        signal: AbortSignal
    ): Promise<void> {
        const itemWidth = this.element.viewBox.baseVal.width / this.itemCount;
        const translations = from.map((item, i) => itemWidth * (to.findIndex(({ id }) => id === item.id) - i));
        const changedItems = translations.filter(translation => translation > 0).length;
        const stepTimingMultiplier = Math.max(1, Math.min(4, changedItems * 0.25));

        if (changedItems === 0) {
            return;
        }

        for (const [ currentIndex, item ] of from.entries()) {
            const element = this.bars.querySelector(`[data-id=\"${item.id}\"]`) as SVGPathElement;
            const translation = translations[currentIndex];

            // Since z-index isn't a thing in SVG we need to make sure elements
            // we want on top gets rendered last.
            if (translation !== 0) {
                this.bars.removeChild(element);
                this.bars.appendChild(element);

                // Trigger reflow to prevent transitions from being ignored.
                element.getBBox();
            }

            element.classList.toggle(SvgAlgorithmVisualization.ITEM_MOVED_CLASS_NAME, Boolean(translation));
            element.style.transform = `translateX(${translation}px)`;
            element.style.transition = `
                fill ${Math.min(this.stepTiming / 4, 250)}ms ease,
                transform ${this.stepTiming * stepTimingMultiplier}ms ease ${this.stepTiming / 2}ms
            `;
        }

        await wait(this.stepTiming / 2 + this.stepTiming * stepTimingMultiplier + this.stepTiming / 2, signal);

        for (const element of this.bars.querySelectorAll("path")) {
            element.classList.remove(SvgAlgorithmVisualization.ITEM_MOVED_CLASS_NAME);
        }
    }

    /**
     * Visualize a comparison operation.
     *
     * @param items - Items being compared.
     * @param signal - Signal indicating whether to abort visualization.
     * @returns Promise resolving when the visualization is complete or aborted.
     */
    private async visualizeComparison(items: Array<SortableItem>, signal: AbortSignal): Promise<void> {
        const elements = this.bars.querySelectorAll("path");

        for (const element of elements) {
            const isBeingCompared = Boolean(items.find(({ id }) => id === element.dataset.id));

            if (isBeingCompared) {
                element.style.transition = `fill ${Math.min(this.stepTiming / 4, 250)}ms ease`;

                // Trigger reflow to prevent transitions from being ignored.
                element.getBBox();
            }

            element.classList.toggle(SvgAlgorithmVisualization.ITEM_COMPARED_CLASS_NAME, isBeingCompared);
        }

        await wait(this.stepTiming, signal);

        for (const element of elements) {
            element.classList.remove(SvgAlgorithmVisualization.ITEM_COMPARED_CLASS_NAME);
        }
    }

    /**
     * Render given item state.
     *
     * @param state - Arbitrary item state.
     */
    private render(state: Array<SortableItem>): void {
        while (this.bars.lastElementChild) {
            this.bars.removeChild(this.bars.lastElementChild);
        }

        const itemWidth = this.element.viewBox.baseVal.width / state.length;
        const spacing = Math.floor(itemWidth / 4);
        const itemHeightUnit = this.element.viewBox.baseVal.height / state.length;
        const rounding = this.element.viewBox.baseVal.width / state.length / 10;

        for (const [ index, item ] of state.entries()) {
            const path = this.element.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");

            path.classList.add("sortable-item");
            path.dataset.id = item.id;
            path.setAttribute("fill", "currentColor");
            path.setAttribute(
                "d",
                [
                    `M${itemWidth * index + spacing / 2},${this.element.viewBox.baseVal.height}`,
                    `v-${itemHeightUnit * item.value - rounding}`,
                    `a${rounding},${rounding},0,0,1,${rounding},-${rounding}`,
                    `h${itemWidth - spacing - rounding * 2}`,
                    `a${rounding},${rounding},0,0,1,${rounding},${rounding}`,
                    `v${itemHeightUnit * item.value - rounding}`,
                    `h-${itemWidth - spacing}`
                ].join(" ")
            );
            path.setAttribute("shape-rendering", "optimizeSpeed");

            this.bars.appendChild(path);
        }
    }
}

export default SvgAlgorithmVisualization;
