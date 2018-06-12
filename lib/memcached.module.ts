import {Memcached} from './memcached.wrapper';
import {Module, DynamicModule, Global} from '@nestjs/common';
import {Options, BootOptions} from './memcached.options';
import {Boot} from 'nest-boot';

@Global()
@Module({})
export class MemcachedModule {
    static init(uri: string[], options: Options): DynamicModule {
        const connectionProvider = {
            provide: 'MemcachedClient',
            useFactory: async (): Promise<Memcached> => await new Memcached(uri, options),
        };
        return {
            module: MemcachedModule,
            components: [connectionProvider],
            exports: [connectionProvider],
        };
    }

    static initWithBoot(options: BootOptions): DynamicModule {
        const connectionProvider = {
            provide: 'MemcachedClient',
            useFactory: async (boot: Boot): Promise<Memcached> => {
                const opts = boot.get(options.path);
                return await new Memcached(opts.uri, opts);
            },
            inject: ['BootstrapProvider']
        };
        return {
            module: MemcachedModule,
            components: [connectionProvider],
            exports: [connectionProvider],
        };
    }
}