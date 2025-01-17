import { describe, test, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { ofetch } from 'ofetch'
import { r } from './utils'

const fixturePath = r('', 'nuxt.com')

describe.skipIf(!existsSync(fixturePath))('nuxt.com', async () => {
  // await setupNuxtTailwind({}, {}, {}, fixturePath)
  // was going to use test-utils but gave up trying to set it up properly

  test('check homepage css', async () => {
    const getStyles = (html: string) => {
      const searchText = '<style>/*! tailwindcss'
      const _styles = html.slice(html.indexOf(searchText) + '<style>'.length)
      return _styles.slice(0, _styles.indexOf('</style>'))
    }

    const builtHtml = readFileSync(`${fixturePath}.output/public/index.html`, 'utf-8')
    const builtStyles = getStyles(builtHtml)

    const expectedHtml: string = await ofetch('https://nuxt.com/')
    const expectedStyles = getStyles(expectedHtml)

    expect(builtStyles.length).toBeGreaterThanOrEqual(expectedStyles.length)
    expect(builtStyles).toBe(expectedStyles)
  })
})