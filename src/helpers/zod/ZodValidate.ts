import { formatErrors, FormErrors } from "./ZodErrorNormalizator";

/** Metodo para verificacion de errores de formulario, errores sujetos a constraints en los schemas
 * En caso de contener un error, devuelve un objeto con un array de errores para cada campo
 * 
 * @param data Objeto para verificar
 * @param schema zSchema (usualmente de registro, encontrados en la carpeta "types")
 * @returns `Array[true if succes, object: result]`
 */
export function zodValidate<T>(data: unknown, schema: any) {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors: FormErrors<T> = result.error.format();
        return [false, { errors: formatErrors(errors) }];
    }

    return [true, {data: result.data as T, errors: null}];
}