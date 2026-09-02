const allowedTags = new Set([
  'a', 'b', 'blockquote', 'br', 'div', 'em', 'font', 'h2', 'h3', 'i', 'li', 'ol',
  'p', 's', 'span', 'strike', 'strong', 'u', 'ul'
])

const colorPattern = /^(?:#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i
const fontSizePattern = /^(?:\d+(?:\.\d+)?(?:px|rem|em|%)|xx-small|x-small|small|medium|large|x-large|xx-large)$/i

function safeHref(value: string) {
  const href = value.trim()
  return /^(?:https?:|mailto:|tel:|\/|#)/i.test(href) ? href : undefined
}

function safeStyle(value: string) {
  const declarations: string[] = []

  for (const part of value.split(';')) {
    const separator = part.indexOf(':')
    if (separator < 0)
      continue

    const property = part.slice(0, separator).trim().toLowerCase()
    const propertyValue = part.slice(separator + 1).trim()
    if (property === 'color' && colorPattern.test(propertyValue))
      declarations.push(`color: ${propertyValue}`)
    else if (property === 'font-size' && fontSizePattern.test(propertyValue))
      declarations.push(`font-size: ${propertyValue}`)
    else if (property === 'text-align' && /^(?:left|center|right|justify)$/.test(propertyValue))
      declarations.push(`text-align: ${propertyValue}`)
  }

  return declarations.join('; ')
}

/** Removes elements and attributes that are not supported by the rich Textarea. */
export function sanitizeRichText(value: string) {
  if (!value || typeof document === 'undefined' || typeof DOMParser === 'undefined')
    return ''

  const source = new DOMParser().parseFromString(value, 'text/html')
  const output = document.createElement('div')

  function append(sourceNode: Node, target: Node) {
    if (sourceNode.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(sourceNode.textContent ?? ''))
      return
    }
    if (!(sourceNode instanceof HTMLElement))
      return

    const tag = sourceNode.tagName.toLowerCase()
    if (tag === 'script' || tag === 'style')
      return
    if (!allowedTags.has(tag)) {
      for (const child of [...sourceNode.childNodes])
        append(child, target)
      return
    }

    const element = document.createElement(tag)
    const style = safeStyle(sourceNode.getAttribute('style') ?? '')
    if (style)
      element.setAttribute('style', style)

    if (tag === 'a') {
      const href = safeHref(sourceNode.getAttribute('href') ?? '')
      if (href) {
        element.setAttribute('href', href)
        element.setAttribute('target', '_blank')
        element.setAttribute('rel', 'noopener noreferrer')
      }
    }
    if (tag === 'font') {
      const size = sourceNode.getAttribute('size')
      const color = sourceNode.getAttribute('color')
      if (size && /^[1-7]$/.test(size))
        element.setAttribute('size', size)
      if (color && colorPattern.test(color))
        element.setAttribute('color', color)
    }

    for (const child of [...sourceNode.childNodes])
      append(child, element)
    target.appendChild(element)
  }

  for (const child of [...source.body.childNodes])
    append(child, output)
  return output.innerHTML
}

/** Converts plain text to the HTML value accepted by the rich Textarea. */
export function plainTextToRichText(value: string) {
  if (!value || typeof document === 'undefined')
    return ''
  const container = document.createElement('div')
  container.textContent = value
  return container.innerHTML.replace(/\r?\n/g, '<br>')
}

/** Returns only the readable text from a rich Textarea value. */
export function richTextToPlainText(value: string) {
  if (!value || typeof DOMParser === 'undefined')
    return ''
  return new DOMParser().parseFromString(sanitizeRichText(value), 'text/html').body.textContent ?? ''
}

export function normalizeRichText(value: string) {
  const containsSupportedTag = /<\/?(?:a|b|blockquote|br|div|em|font|h[23]|i|li|ol|p|s|span|strike|strong|u|ul)\b/i.test(value)
  return containsSupportedTag ? sanitizeRichText(value) : plainTextToRichText(value)
}
