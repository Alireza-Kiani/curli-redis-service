import { createHash } from 'crypto';

export default (input: string): string => {
    const hash = createHash('shake256', { outputLength: 5 });

    hash.update(input);

    return hash.digest('hex');
}