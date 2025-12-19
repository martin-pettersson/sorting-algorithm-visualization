/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
    AlgorithmVisualizationControls,
    SvgAlgorithmVisualization
} from "@martin-pettersson/sorting-algorithms/components/index.js";
import { Application, ApplicationBuilder, DelegateApplicationBuilder, ServiceProvider } from "@n7e/framework";
import { LinearCongruentialGenerator } from "@n7e/rng";
import { SortingAlgorithmRegistry } from "@martin-pettersson/sorting-algorithms/algorithms/index.js";

/**
 * Provides an application delegate.
 */
class ApplicationDelegateProvider implements ServiceProvider {
    /** {@inheritDoc} */
    public configure(applicationBuilder: ApplicationBuilder): void {
        (applicationBuilder as DelegateApplicationBuilder).useDelegate(this.run.bind(this));
    }

    /**
     * Set up application components.
     *
     * @param application - Application instance.
     * @returns Promise resolving when the operation is done.
     */
    private async run(application: Application): Promise<void> {
        const browsingContext = application.resolve<Window>("browsingContext");
        const algorithms = application.resolve<SortingAlgorithmRegistry>("sortingAlgorithmRegistry");
        const algorithmVisualization = new SvgAlgorithmVisualization(
            new LinearCongruentialGenerator(),
            algorithms.use("selection")
        );
        const algorithmVisualizationControls = new AlgorithmVisualizationControls(algorithmVisualization, algorithms);

        algorithmVisualization.setUp(browsingContext.document.querySelector(".js-svg-algorithm-visualization")!);
        algorithmVisualizationControls.setUp(
            browsingContext.document.querySelector(".js-algorithm-visualization-controls")!
        );
    }
}

export default ApplicationDelegateProvider;
