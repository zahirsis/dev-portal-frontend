export type LabelValue = { code: string, label: string, customClasses?: string }
export type optionValue = { value: string, label: string }
export type NumberValue = { value: number, step: number, min: number, max: number }
export type DataValue = { default?: string, fixed: string, custom?: string, customizable: boolean }
export type ResourceValues = { min: NumberValue, max: NumberValue }