export function logAndReturn<T>(el: T): T {
    console.log(el);
    return el;
}
