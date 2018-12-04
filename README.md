# Dev CLI

A stupid command-line tool to run scripts.

## Install

~~npm install -g dev-cli~~ Coming soon. For now clone this repo and run `npm link`

Pop a `.devrc` file in your project directory and go to town.

```json
{
  "scripts": {
    "start": "~/.hyper_plugins/node_modules/hyperlayout/bin/hyperlayout",
    "postico": "open postgres://postgres:postgres@$(docker-compose port pg 5432)/my_cool_database",
    "exec": "docker-compose exec rails bundle exec $@"
  }
}
```

## Usage

`dev [options] <cmd>`

## Options

```
  -v, --version  output the version number
  -h, --help     output usage information
```

## Contribute

Clone, run `npm start`. Work.

## Tests

No tests yet. Yep, I'm a bad person.
