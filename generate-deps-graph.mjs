import { writeFile } from 'fs/promises'
import { join } from 'path'
import { dir } from 'console'

import { globby } from 'globby'
import madge from 'madge'

const skippedSet = new Set()
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
  edges.map((edge) => edge.join(',')).join('\n'),
)

skippedSet.forEach((path) => console.log(path))

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
  const response = await madge(filePath)
  const depends = response
    .obj()
    [filePath.match(/[^/]+$/)[0]].map((path) => join(directory, path))
    .map(prettifyFilePath)

  const { skipped } = response.warnings()
  const indexPaths = extractIndexFile(skipped)
    .map((path) => join(directory, path))
    .map(prettifyFilePath)
  const internalPackages =
    extractInternalPackages(skipped).map(prettifyFilePath)

  skipped
    .filter((path) => path.startsWith('.') === false)
    .filter((path) => isInternalPackage(path) === false)
    .forEach((path) => {
      skippedSet.add(path)
    })

  return {
    filePath: prettifyFilePath(filePath),
    depends: depends.concat(indexPaths).concat(internalPackages),
  }
}

function extractIndexFile(skipped) {
  return skipped
    .filter((path) => path.startsWith('.'))
    .map((path) => `${path}/index.ts`)
}

function extractInternalPackages(skipped) {
  return skipped.filter(isInternalPackage).map((path) => {
    if (new RegExp(`${internalPackages.join('|')}$`).test(path) === true) {
      return `${path.replace('@titicaca/', '')}/index.ts`
    }
    return `${path.replace('@titicaca/', '')}.ts`
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
