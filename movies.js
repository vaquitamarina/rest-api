import z from 'zod';
const movieSchema = z.object({
  title: z.string(),
  year: z.number().int().positive(),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url(),
  genre: z.array(z.enum(['Action', 'Animation', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Sci-fi'])),
  rate: z.number().positive().default(5.0),
})

export function validateMovie(movie) {
  return movieSchema.safeParse(movie);
}

export function validatePartialMovie(movie) {
  return movieSchema.partial().safeParse(movie);
}