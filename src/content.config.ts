import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/projects' }),
    schema: z.object({
        name: z.string(),
        date: z.string(),
        order: z.number(),
        description: z.string(),
        /* root-relative path into public/, e.g. /images/projects/wlday.png */
        image: z.string().startsWith('/images/projects/'),
        stack: z.array(z.string()).default([]),
        href: z.url().optional(),
        /* shown as a tooltip when there is no href */
        note: z.string().optional(),
    }),
});

export const collections = { projects };
