export interface IPlugin {
  name: string;
  onTestStart?: (snippet: unknown) => void;
  onKeyPress?: (key: string, timestamp: number) => void;
  onTestEnd?: (result: unknown) => void;
}

export class PluginManager {
  private plugins: IPlugin[] = [];

  register(plugin: IPlugin) {
    this.plugins.push(plugin);
    console.log(`[PluginManager] Registered plugin: ${plugin.name}`);
  }

  triggerTestStart(snippet: unknown) {
    this.plugins.forEach((p) => p.onTestStart?.(snippet));
  }

  triggerKeyPress(key: string, timestamp: number) {
    this.plugins.forEach((p) => p.onKeyPress?.(key, timestamp));
  }

  triggerTestEnd(result: unknown) {
    this.plugins.forEach((p) => p.onTestEnd?.(result));
  }

  getAll(): IPlugin[] {
    return [...this.plugins];
  }
}

export const pluginManager = new PluginManager();
