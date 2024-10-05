import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import chokidar from 'chokidar'
import fs from 'fs'
import yaml from 'js-yaml'
import path from "path"
import { logger } from "~/server/logger";


export default defineNitroPlugin((nitroApp) => {
  const yamlFilePath = path.resolve('./assets/prompt/prompts.yaml')
  // console.log({ yamlFilePath })

  const readYamlFile = () => {
    try {
      const fileContent = fs.readFileSync(yamlFilePath, 'utf8')
      return yaml.load(fileContent)
    } catch (error) {
      logger.error(`Error reading YAML file:, ${JSON.stringify(error)}`)
      return {}
    }
  }

  let yamlContent = readYamlFile()

  const watcher = chokidar.watch(yamlFilePath, {
    persistent: true,
    ignoreInitial: true
  })

  watcher.on('change', async () => {
    console.log(`File ${yamlFilePath} has been changed`)
    yamlContent = readYamlFile()

    try {
      await $fetch('/api/prompt', {
        method: 'PUT',
        body: JSON.stringify(yamlContent)
      })
      logger.info('YAML content sent to API')
    } catch (error) {
      logger.error(`Error sending YAML content to API:, ${JSON.stringify(error)}`)
    }
  })

  nitroApp.hooks.hook('request', (event) => {
    event.context.yamlContent = yamlContent
  })
})