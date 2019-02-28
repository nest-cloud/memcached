import { Memcached } from './memcached.wrapper';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { Options } from './memcached.options';
import { Boot } from 'nest-boot';
import { ConsulConfig } from "nest-consul-config";
import {
    NEST_MEMCACHED_PROVIDER,
    NEST_BOOT,
    NEST_CONSUL_CONFIG,
    NEST_BOOT_PROVIDER,
    NEST_CONSUL_CONFIG_PROVIDER
} from "nest-common";

@Global()
@Module({})
export class MemcachedModule {
    static register(options: Options): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.indexOf(NEST_BOOT) !== -1) {
                inject.push(NEST_BOOT_PROVIDER);
            }
            if (options.dependencies.indexOf(NEST_CONSUL_CONFIG) !== -1) {
                inject.push(NEST_CONSUL_CONFIG_PROVIDER)
            }
        }

        if (options.adapter === NEST_BOOT) {
            inject.push(NEST_BOOT_PROVIDER);
        } else if (options.adapter === NEST_CONSUL_CONFIG) {
            inject.push(NEST_CONSUL_CONFIG_PROVIDER);
        }
        const connectionProvider = {
            provide: NEST_MEMCACHED_PROVIDER,
            useFactory: async (config: Boot | ConsulConfig): Promise<Memcached> => {
                if (options.dependencies) {
                    if (options.dependencies.indexOf(NEST_BOOT) !== -1) {
                        options = config.get('memcached');
                    }
                    if (options.dependencies.indexOf(NEST_CONSUL_CONFIG) !== -1) {
                        options = await config.get('memcached');
                    }
                }
                if (options.adapter === NEST_BOOT) {
                    options = config.get('memcached');
                } else if (options.adapter === NEST_CONSUL_CONFIG) {
                    options = await config.get('memcached');
                }
                return await new Memcached(options.uri, options)
            },
            inject,
        };
        return {
            module: MemcachedModule,
            components: [connectionProvider],
            exports: [connectionProvider],
        };
    }
}
