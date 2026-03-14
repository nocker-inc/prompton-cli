# @nocker-inc/prompton

CLI for [prompton.io](https://prompton.io)

## Install

```sh
npm i -g @nocker-inc/prompton
```

## Usage

```sh
# Works
prompton works                          # List works (JSON)
prompton works <id>                     # Show work detail
prompton works --search "猫" --limit 3  # Search works

# Users
prompton users                          # List users
prompton users <id>                     # Show user detail
prompton users <id> works               # List user's works

# Options
prompton works --help                   # Show command help
prompton works -t                       # Human-readable output
```

Output is JSON by default. Use `--text` (`-t`) for human-readable format.

## License

MIT
