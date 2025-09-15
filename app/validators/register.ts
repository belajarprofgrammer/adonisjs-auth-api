import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine
    .object({
      name: vine
        .string()
        .minLength(3)
        .maxLength(100)
        .trim(),
      email: vine
        .string()
        .email()
        .unique({
          table: 'users',
          column: 'email',
        }),
      password: vine
        .string()
        .minLength(8)
        .maxLength(100)
        .confirmed(),
    })
    .toCamelCase()
)
