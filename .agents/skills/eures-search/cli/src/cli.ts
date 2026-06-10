import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "eures-cli",
  version: "1.0.0",
  description: "CLI for EURES — EU official cross-border job portal",
})

cli.command(search)
cli.command(detail)

await cli.run()
