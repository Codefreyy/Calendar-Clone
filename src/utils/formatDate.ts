
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    // We can also set the first param to be undefined which enables to enerate localised date strings according to different regions and language environments
    return new Intl.DateTimeFormat("en-US", options).format(date)
}