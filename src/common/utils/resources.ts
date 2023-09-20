
export const formatCpu = (value: number) => {
    return value < 1 ? `${(value * 1000).toFixed(0)}m` : `${value}`
}

export const formatMemory = (value: number) => {
    return value < 1024 ? `${value}Mi` : `${(value / 1024).toFixed(1)}Gi`
}