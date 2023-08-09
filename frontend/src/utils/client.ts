import { createClient } from '@sanity/client';
import imageBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: 'ivi3nrzf',
    dataset: 'production',
    apiVersion: '2023-07-21',
    useCdn: false,
    token: 'skK8kbcgDHhih1A4WtnqbSYRDW8tXaLNo7rPhkELyAz1SWN2NGEcjf2n65nSMT1da73RWyWi4UNkNtPL3zBvXqp1ccrPi4pwH6Yv7smTYN0t83hhUG9FUnUPVRdew49T8BRcWY5VnRYpQ3QWgfiOnzUBAZp4vFdEsFZSp7Fqu7P7UA6MWS5n',
});

const builder = imageBuilder(client)

export const urlFor = (source: any) => builder.image(source)