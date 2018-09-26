import { Inject } from '@nestjs/common';

export const InjectMemcachedClient = () => Inject('MemcachedClient');