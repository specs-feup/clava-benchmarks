import LocalFolder from "lara-js/api/lara/util/LocalFolder.js";
import { Engine, engine } from "lara-js/api/lara/util/JavaTypes.js";

export default class HiFlipVXBenchmarkResources extends LocalFolder {
    constructor() {
        let filepath;
        if (engine == Engine.GraalVM) {
            filepath = __dirname;
        } else {
            filepath = import.meta.dirname;
        }

        super(filepath);
    }
}
