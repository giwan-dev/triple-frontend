import { writeFile } from 'fs/promises'
import { join } from 'path'

import { globby } from 'globby'
import madge from 'madge'

const internalPackages = await getMonorepoPackages()
const files = await getFiles()
const dependencies = await Promise.all(files.map(getDependencyList))
const edges = dependencies
  .map(({ filePath, depends }) => depends.map((depend) => [filePath, depend]))
  .reduce((sum, current) => sum.concat(current))

await writeFile(
  './edge-table.csv',
  edges.map((edge) => edge.join(',')).join('\n'),
)

async function getMonorepoPackages() {
  const paths = await globby('packages/*/package.json')
  return paths.map(
    (path) =>
      `@titicaca/${path.replace('packages/', '').replace('/package.json', '')}`,
  )
}

async function getFiles() {
  const paths = await globby('packages/*/src/**/*.{ts,tsx}')
  paths.sort()
  return paths
}

async function getDependencyList(filePath) {
  const response = await madge(filePath)
  const depends = response.depends(filePath)
  const { skipped } = response.warnings()
  const { depends: finalDepends } = includeInternalPackage(
    includeIndexFile({ depends, skipped }),
  )

  return {
    filePath: filePath.replace(/\.tsx?/, ''),
    depends: finalDepends.map((path) => {
      if (path.startsWith('.') === true) {
        const joined = join(filePath.replace(/\/[^/]+$/, ''), path)
        return joined
      }
      return path
    }),
  }
}

function includeIndexFile({ depends, skipped }) {
  const isIndexFile = (path) => path.startsWith('.')

  return {
    depends: depends.concat(
      skipped.filter(isIndexFile).map((path) => `${path}/index`),
    ),
    skipped: skipped.filter((path) => isIndexFile(path) === false),
  }
}

function includeInternalPackage({ depends, skipped }) {
  const isInternalPackage = (path) =>
    new RegExp(`${internalPackages.join('|')}($|/.+)`).test(path)

  return {
    depends: depends.concat(
      skipped.filter(isInternalPackage).map((path) => {
        if (new RegExp(`${internalPackages.join('|')}$`).test(path) === true) {
          return `${path.replace('@titicaca/', 'packages/')}/index`
        }
        return path.replace('@titicaca/', 'packages/')
      }),
    ),
    skipped: skipped.filter((path) => isInternalPackage(path) === false),
  }
}
