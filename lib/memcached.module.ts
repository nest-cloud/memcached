import {Memcached} from './memcached.wrapper';
import {Module, DynamicModule, Global} from '@nestjs/common';
import {MemcachedOptions} from './memcached.options';

@Global()
@Module({})
export class MemcachedModule {
    static forRoot(
        uri: string[],
        options: MemcachedOptions,
    ): DynamicModule {
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
}