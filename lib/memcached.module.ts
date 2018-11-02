import { Memcached } from './memcached.wrapper';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { Options } from './memcached.options';
import { Boot } from 'nest-boot';
import { ConsulConfig } from "nest-consul-config";
import { MEMCACHED_PROVIDER, BOOT_ADAPTER, CONSUL_ADAPTER } from "./constants";

@Global()
@Module({})
export class MemcachedModule {
    static register(options: Options): DynamicModule {
        const inject = [];
        if (options.adapter === BOOT_ADAPTER) {
            inject.push('BootstrapProvider');
        } else if (options.adapter === CONSUL_ADAPTER) {
            inject.push('ConsulConfigClient');
        }
        const connectionProvider = {
            provide: MEMCACHED_PROVIDER,
            useFactory: async (config: Boot | ConsulConfig): Promise<Memcached> => {
                if (options.adapter === BOOT_ADAPTER) {
                    options = config.get('memcached');
                } else if (options.adapter === CONSUL_ADAPTER) {
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