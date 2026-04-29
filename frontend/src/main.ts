import { TypingTest } from "./components/TypingTest";
import { pluginManager } from "./plugins/PluginManager";
import { memoryModePlugin } from "./plugins/memoryMode";

// Register plugins — toggle enabled: true to activate memory mode
pluginManager.register(memoryModePlugin);

const app = document.getElementById("app")!;
const test = new TypingTest(app);
test.init();
