import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "arbeitnow-cli",
  version: "1.0.0",
  description: "CLI for Arbeitnow job board — EU jobs with visa sponsorship filter",
})

cli.command(search)
cli.command(detail)

await cli.run()
