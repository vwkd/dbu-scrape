# README

Scrape groups from DBU



## Requirements

- Deno



## Usage

- scrape groups

```sh
deno task groups
```

- can browse `out/groups.json` with Nushell

```nu
open out/groups.json
```

- e.g. specific tradition at zip codes

```nu
open out/groups.json
  | where tradition =~ 'Theravada'
  | filter {|row| $row.address
    | regex '(?:12|34|56|78)\d{3}'
    | is-not-empty
  }
```
