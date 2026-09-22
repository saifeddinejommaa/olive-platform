import type { CoreConfig } from './CoreConfig';

let configuration: CoreConfig | null = null;

export function configureCore(config: CoreConfig) {
configuration = config;
}

export function getCoreConfig(): CoreConfig {
if (!configuration) {
throw new Error(
'Core is not configured. Call configureCore() before using the core.',
);
}

return configuration;
}