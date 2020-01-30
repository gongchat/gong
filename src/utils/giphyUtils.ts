const apiKey = 'NLqEDJs1cMM2txaZft2SvMJGaaFKyygd';

export const getGiphySearchUrl = (search: string) =>
  `http://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=10`;
