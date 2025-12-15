/*
 * Copyright (c) 2025 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import handlebars from "vite-plugin-handlebars";
import lightningcss from "vite-plugin-lightningcss";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    base: "",
    publicDir: "resources/public",
    build: {
        sourcemap: false,
        emptyOutDir: true,
        minify: "terser",
        cssMinify: "lightningcss"
    },
    plugins: [
        handlebars({
            partialDirectory: resolve(process.cwd(), "resources/html")
        }),
        lightningcss(),
        visualizer()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern",
                loadPaths: [
                    "resources/sass"
                ]
            }
        }
    },
    resolve: {
        alias: {
            ["@martin-pettersson/sorting-algorithms"]: resolve(process.cwd(), "resources/typescript")
        }
    }
});
