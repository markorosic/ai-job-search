import { createCLI } from "@bunli/core"
import { search } from "./commands/search.js"
import { detail } from "./commands/detail.js"

const cli = await createCLI({
  name: "nofluffjobs-cli",
  version: "1.0.0",
  description: "CLI for NoFluffJobs — tech jobs in Poland/Czechia with salary data",
})

cli.command(search)
cli.command(detail)

await cli.run()
