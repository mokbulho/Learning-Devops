import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, strict: false });

export function validateSchema(schema: object, data: unknown): void {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }
}
