#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { error } = require('console')

const prettier = require('prettier')

const {
  dependencies,
  devDependencies,
  peerDependencies,
} = require(path.resolve(process.cwd(), './package.json'))
const tsconfig = require(path.resolve(process.cwd(), './tsconfig.json'))

const references = [
  ...dependenciesToReferences(dependencies),
  ...dependenciesToReferences(devDependencies),
  ...dependenciesToReferences(peerDependencies),
].sort()

const newTsconfig = {
  ...tsconfig,
  references: references.length > 0 ? references : undefined,
}

fs.writeFile(
  path.resolve(process.cwd(), './tsconfig.json'),
  prettier.format(`${JSON.stringify(newTsconfig, null, '  ')}\n`, {
    parser: 'json',
  }),
  { encoding: 'utf8' },
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  (err) => {
    if (err) {
      error(err)
    }
  },
)

function dependenciesToReferences(deps) {
  if (!deps) {
    return []
  }
  return Object.keys(deps)
    .filter((packageName) => packageName.startsWith('@titicaca/'))
    .map((packageName) =>
      path.relative(
        process.cwd(),
        path.join(
          process.env.LERNA_ROOT_PATH,
          './packages',
          packageName.replace('@titicaca/', ''),
        ),
      ),
    )
    .filter((packagePath) => fs.existsSync(packagePath))
    .map((path) => ({ path }))
}
