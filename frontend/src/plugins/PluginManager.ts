export interface IPlugin {
  name: string;
  description?: string;
  enabled: boolean;
  onTestStart?: (snippet: unknown) => void;
  onKeyPress?: (key: string, timestamp: number) => void;
  onTestEnd?: (result: unknown) => void;
}

export class PluginManager {
  private plugins: IPlugin[] = [];

  register(plugin: IPlugin) {
    this.plugins.push(plugin);
    console.log(`[PluginManager] Registered: ${plugin.name}`);
  }

  triggerTestStart(snippet: unknown) {
    this.active().forEach((p) => p.onTestStart?.(snippet));
  }

  triggerKeyPress(key: string, timestamp: number) {
    this.active().forEach((p) => p.onKeyPress?.(key, timestamp));
  }

  triggerTestEnd(result: unknown) {
    this.active().forEach((p) => p.onTestEnd?.(result));
  }

  enable(name: string) {
    const p = this.plugins.find((p) => p.name === name);
    if (p) p.enabled = true;
  }

  disable(name: string) {
    const p = this.plugins.find((p) => p.name === name);
    if (p) p.enabled = false;
  }

  private active(): IPlugin[] {
    return this.plugins.filter((p) => p.enabled);
  }

  getAll(): IPlugin[] {
    return [...this.plugins];
  }
}

export const pluginManager = new PluginManager();
