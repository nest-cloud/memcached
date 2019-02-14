import { Inject } from '@nestjs/common';
import { NEST_MEMCACHED_PROVIDER } from 'nest-common';

export const InjectMemcachedClient = () => Inject(NEST_MEMCACHED_PROVIDER);
