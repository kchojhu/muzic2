export class ApplicationUtil {
    public static hash(value: string): number {
            return value.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

}