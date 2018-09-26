import { Memcached } from './memcached.wrapper';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { Options, BootOptions, ConfigOptions } from './memcached.options';
import { Boot } from 'nest-boot';
import { ConsulConfig } from "nest-consul-config";
import { MEMCACHED_PROVIDER } from "./constants";

@Global()
@Module({})
export class MemcachedModule {
    static register(uri: string[], options: Options): DynamicModule {
        const connectionProvider = {
            provide: MEMCACHED_PROVIDER,
            useFactory: async (): Promise<Memcached> => await new Memcached(uri, options),
        };
        return {
            module: MemcachedModule,
            components: [connectionProvider],
            exports: [connectionProvider],
        };
    }

    static registerByBoot(options: BootOptions): DynamicModule {
        const connectionProvider = {
            provide: MEMCACHED_PROVIDER,
            useFactory: (boot: Boot): Memcached => {
                const opts = boot.get(options.path);
                return new Memcached(opts.uri, opts);
            },
            inject: ['BootstrapProvider']
        };
        return {
            module: MemcachedModule,
            components: [connectionProvider],
            exports: [connectionProvider],
        };
    }

    static registerByConsul(options: ConfigOptions): DynamicModule {
        const connectionProvider = {
            provide: 'MemcachedClient',
            useFactory: async (config: ConsulConfig): Promise<Memcached> => {
                const opts = await config.get(options.path);
                return new Memcached(opts.uri, opts);
            },
            inject: ['ConsulConfigClient']
        };
        return {
            module: MemcachedModule,
            components: [connectionProvider],
            exports: [connectionProvider],
        };
    }
}