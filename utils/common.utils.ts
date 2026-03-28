/**
 * to replace placeholder in html template
 * @param template
 * @param data
 */
export const parseTemplate = (
    template: string,
    data: Record<string, string>
): string => {
    let html = template;

    Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        html = html.replace(regex, data[key]);
    });

    return html;
};


export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


type AnyObject = Record<string, unknown>;

const DEFAULT_REMOVE_FIELDS = [
    "deletedAt",
    "isDeleted",
    "password",
    "hashpassword",
    "updatedAt",
    "createdAt",
];

/**
 * Remove sensitive / unwanted fields from object
 * @param data object or array
 * @param keepTimestamps if true → keeps createdAt & updatedAt
 */
export const sanitize = <T>(
    data: T,
    keepTimestamps: boolean = false
): T => {
    if (!data) return data;

    const removeFields = keepTimestamps
        ? DEFAULT_REMOVE_FIELDS.filter(
            (field) => field !== "createdAt" && field !== "updatedAt"
        )
        : DEFAULT_REMOVE_FIELDS;

    const cleanObject = (obj: AnyObject) => {
        const newObj: AnyObject = {};

        Object.keys(obj).forEach((key) => {
            if (!removeFields.includes(key)) {
                newObj[key] = obj[key];
            }
        });

        return newObj;
    };

    // handle array
    if (Array.isArray(data)) {
        return data.map((item) => cleanObject(item)) as T;
    }

    // handle object
    return cleanObject(data as AnyObject) as T;
};