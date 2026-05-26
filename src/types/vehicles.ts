export type PlateFormat = {
  placeholder: string
  hint: string
  regex: RegExp
  mask: (raw: string) => string
}
