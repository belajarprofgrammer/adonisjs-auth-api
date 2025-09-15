import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine
    .object({
      email: vine
        .string()
        .email()
        .exists({
          table: 'users',
          column: 'email',
        }),
      password: vine
        .string()
        .minLength(8)
        .maxLength(100),
    })
    .toCamelCase()
)
