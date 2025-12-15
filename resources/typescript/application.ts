/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationDelegateProvider, SortingAlgorithmProvider } from "@martin-pettersson/sorting-algorithms/service-providers/index.js";
import { DelegateApplicationBuilder } from "@n7e/framework";

const applicationBuilder = new DelegateApplicationBuilder();

applicationBuilder.configure(applicationBuilder => applicationBuilder.register("browsingContext", () => window));
applicationBuilder.use(new ApplicationDelegateProvider())
applicationBuilder.use(new SortingAlgorithmProvider());

applicationBuilder.build().then(application => application.run());
