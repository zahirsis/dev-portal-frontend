
export const checkboxColor = (accentColor: string) => {
    const colorClasses = `text-${accentColor}-500 focus:ring-${accentColor}-500 dark:focus:ring-${accentColor}-600`

    return colorClasses
}