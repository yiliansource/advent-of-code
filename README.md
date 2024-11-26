# Advent of Code

This repository is a collection of my solutions for **Advent of Code**, equipped together with a runner to easily fetch, validate, run and submit them.

## Usage

Make sure you have a valid session token specified in your `.env` file:

```env
AOC_SESSION_TOKEN=<your-token-here>
```

After that, the following commands are at your disposal:

```cmd
yarn session
yarn solve [--year <year>] [--day <day>] [--part <part>] [--submit]
yarn test [--year <year>] [--day <day>] [--part <part>]
yarn scaffold [--year <year>] [--day <day>] [--fetch-only] [--skip-wait]
yarn bench [--year <year>] [--day <day>] [--fetch-only] [--iterations <count>]
```
