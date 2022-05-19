import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

import { globby } from 'globby'
import madge from 'madge'

const internalPackages = await getMonorepoPackages()
const isInternalPackage = (path) =>
  new RegExp(`${internalPackages.join('|')}($|/.+)`).test(path)
const files = await getFiles()
const dependencies = await Promise.all(files.map(getDependencyList))
const edges = dependencies
  .map(({ filePath, depends }) => depends.map((depend) => [filePath, depend]))
  .reduce((sum, current) => sum.concat(current))

await writeFile(
  './edge-table.csv',
  `source,target\n${edges.map((edge) => edge.join(',')).join('\n')}`,
)

async function getMonorepoPackages() {
  const paths = await globby('packages/*/package.json')
  return paths.map(
    (path) =>
      `@titicaca/${path.replace('packages/', '').replace('/package.json', '')}`,
  )
}

async function getFiles() {
  const paths = await globby(['packages/*/src/**/*.{ts,tsx}', '!**/*.test.*'])
  paths.sort()
  return paths
}

async function getDependencyList(filePath) {
  const directory = filePath.replace(/[^/]+$/, '')
  const response = await madge(filePath, {
    tsConfig: `${filePath.match(/(packages\/[^/]+)/)[0]}/tsconfig.json`,
  })
  const depends = response
    .obj()
    [filePath.match(/[^/]+$/)[0]].map((path) => join(directory, path))
    .map(prettifyFilePath)

  const { skipped } = response.warnings()
  const indexPaths = (await extractIndexFile(skipped, directory)).map(
    prettifyFilePath,
  )
  const internalPackages = (
    await extractInternalPackages(skipped, filePath)
  ).map(prettifyFilePath)

  return {
    filePath: prettifyFilePath(filePath),
    depends: depends.concat(indexPaths).concat(internalPackages),
  }
}

async function extractIndexFile(skipped, directory) {
  return (
    await Promise.all(
      skipped
        .filter((path) => path.startsWith('.') === true)
        .map(async (path) => {
          const globbed = await globby(
            join(directory, `${path}/index.{ts,tsx}`),
          )
          if (globbed.length === 0) {
            return null
          }
          return join(directory, path)
        }),
    )
  )
    .filter(Boolean)
    .map((path) => `${path}/index.ts`)
}

async function extractInternalPackages(skipped, filePath) {
  const file = (await readFile(filePath)).toString()

  return skipped
    .filter(isInternalPackage)
    .filter((path) => file.includes(path) === true)
    .map((path) => {
      if (new RegExp(`${internalPackages.join('|')}$`).test(path) === true) {
        return `${path.replace('@titicaca/', 'packages/')}/index.ts`
      }
      return `${path.replace('@titicaca/', 'packages/')}.ts`
    })
}

function prettifyFilePath(path) {
  try {
    return path.match(/packages\/(.+)(\.tsx?)$/)[1].replace('src/', '')
  } catch (error) {
    console.error(path)
    throw error
  }
}
