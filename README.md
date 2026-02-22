# CatalogoDePeliculas
Movie catalog powered by TMDB API with sections: Popular, Top Rated, and Upcoming.

## Secure API key setup
1. Create `.env` in project root.
2. Add:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=3000
```

3. Start the app:

```bash
npm start
```

The frontend now calls `/api/tmdb/*` and the server injects the private TMDB key from `.env`.
