/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SortingAlgorithmRegistry } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";
import type { Component, AlgorithmVisualization } from "@martin-pettersson/sorting-algorithms/components/index.js";

/**
 * Represents the visualization controls.
 *
 * This component will handle any interactions with the controls as well as
 * propagating desired actions to the visualization.
 */
class AlgorithmVisualizationControls implements Component {
    /**
     * Class name used to indicate that the visualization is running.
     */
    private static START_STOP_RUNNING_CLASS_NAME = "algorithm-visualization-controls__start-stop--running";

    /**
     * Associated algorithm visualization.
     */
    private readonly visualization: AlgorithmVisualization;

    /**
     * Registered algorithms.
     */
    private readonly algorithms: SortingAlgorithmRegistry;

    /**
     * Whether the visualization is running.
     */
    private isRunning: boolean;

    /**
     * Algorithm select control.
     */
    private algorithmSelection!: HTMLSelectElement;

    /**
     * Item count control.
     */
    private itemCountControl!: HTMLInputElement;

    /**
     * Item count text.
     */
    private itemCountText!: Text;

    /**
     * Start-stop control button.
     */
    private startStop!: HTMLButtonElement;

    /**
     * Reset control button.
     */
    private resetControl!: HTMLButtonElement;

    /**
     * Scramble control button.
     */
    private scrambleControl!: HTMLButtonElement;

    /**
     * Visualize comparisons checkbox.
     */
    private visualizeComparisonsControl!: HTMLInputElement;

    /**
     * Step speed control.
     */
    private speedControl!: HTMLInputElement;

    /**
     * Create a new component instance.
     *
     * @param visualization - Associated algorithm visualization.
     * @param algorithms - Registered algorithms.
     */
    public constructor(visualization: AlgorithmVisualization, algorithms: SortingAlgorithmRegistry) {
        this.visualization = visualization;
        this.algorithms = algorithms;
        this.isRunning = false;
    }

    /** {@inheritDoc} */
    public setUp(element: HTMLElement): void {
        this.algorithmSelection = element.querySelector(".js-algorithm-visualization-controls__algorithms")!;
        this.itemCountControl = element.querySelector(".js-algorithm-visualization-controls__item-count")!;
        this.itemCountText = element.ownerDocument.createTextNode(this.itemCountControl.value);
        this.startStop = element.querySelector(".js-algorithm-visualization-controls__start-stop")!;
        this.resetControl = element.querySelector(".js-algorithm-visualization-controls__reset")!;
        this.scrambleControl = element.querySelector(".js-algorithm-visualization-controls__scramble")!;
        this.visualizeComparisonsControl = element.querySelector(
            ".js-algorithm-visualization-controls__visualize-comparisons"
        )!;
        this.speedControl = element.querySelector(".js-algorithm-visualization-controls__speed")!;

        this.itemCountControl.parentNode!.prepend(this.itemCountText);

        this.algorithmSelection.addEventListener("change", this.selectAlgorithm.bind(this));
        this.itemCountControl.addEventListener("input", this.selectItemCount.bind(this));
        this.startStop.addEventListener("click", this.toggleRunning.bind(this));
        this.resetControl.addEventListener("click", () => this.visualization.reset());
        this.scrambleControl.addEventListener("click", () => this.visualization.scramble());
        this.visualizeComparisonsControl.addEventListener("change", this.selectComparisonsVisualization.bind(this));
        this.speedControl.addEventListener("input", this.selectStepTiming.bind(this));

        this.visualization.addEventListener("start", this.indicateRunning.bind(this));
        this.visualization.addEventListener("stop", this.indicateNotRunning.bind(this));

        this.selectItemCount();
        this.selectStepTiming();
        this.selectComparisonsVisualization();
    }

    /**
     * Select current algorithm.
     */
    private selectAlgorithm(): void {
        this.visualization.useAlgorithm(this.algorithms.use(this.algorithmSelection.value));
    }

    /**
     * Select current item count value.
     */
    private selectItemCount(): void {
        this.itemCountText.textContent = this.itemCountControl.value;
        this.visualization.useItemCount(parseInt(this.itemCountControl.value));
    }

    /**
     * Select current step timing value.
     */
    private selectStepTiming(): void {
        this.visualization.useStepTiming(1_000 / parseInt(this.speedControl.value));
    }

    /**
     * Toggle running of the visualization.
     */
    private toggleRunning(): void {
        if (this.isRunning) {
            this.visualization.stop();

            return;
        }

        this.visualization.start();
    }

    /**
     * Toggle comparisons visualization.
     */
    private selectComparisonsVisualization(): void {
        this.visualization.visualizeComparisons(this.visualizeComparisonsControl.checked);
    }

    /**
     * Indicate that the visualization is running.
     */
    private indicateRunning(): void {
        this.isRunning = true;

        this.startStop.classList.toggle(AlgorithmVisualizationControls.START_STOP_RUNNING_CLASS_NAME, this.isRunning);
    }

    /**
     * Indicate that the visualization is not running.
     */
    private indicateNotRunning(): void {
        this.isRunning = false;

        this.startStop.classList.toggle(AlgorithmVisualizationControls.START_STOP_RUNNING_CLASS_NAME, this.isRunning);
    }
}

export default AlgorithmVisualizationControls;
