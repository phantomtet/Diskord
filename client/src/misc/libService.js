export const toFileSize = (num) => {
    if (!num) return '0 B'
    num = +num
    let ext = 'B'
    let array = ['KB', 'MB', 'GB', 'TB']
    for (let a in array) {
        if (num < 1024) break
        num /= 1024
        ext =  array[a]
    }
    return `${+num.toFixed(2)} ${ext}`
}