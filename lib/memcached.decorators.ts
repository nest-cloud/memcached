import { Inject } from '@nestjs/common';
import { MEMCACHED_PROVIDER } from './constants';

export const InjectMemcachedClient = () => Inject('MEMCACHED_PROVIDER');