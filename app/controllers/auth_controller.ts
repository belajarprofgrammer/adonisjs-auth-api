import type { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
import User from '#models/user'
import { registerValidator } from '#validators/register';
import { loginValidator } from '#validators/login';

export default class AuthController {
  /**
   * Register a new account.
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = new User()
    user.fullName = payload.name
    user.email = payload.email
    user.password = payload.password
    await user.save()

    return response.created({
      code: StatusCodes.CREATED,
      status: StatusCodes[StatusCodes.CREATED],
      data: user.serialize(),
    })
  }

  /**
   * Login and return auth token.
   */
  async login({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(payload.email, payload.password)
    const token = await auth.use('api').createToken(user, ['*'], {
      name: 'access-token',
      expiresIn: '7 days',
    })

    return response.ok({
      code: StatusCodes.OK,
      status: StatusCodes[StatusCodes.OK],
      data: {
        accessToken: token.value!.release(),
        expiredAt: token.expiresAt!.getTime(),
      },
    })
  }

  /**
   * Get current user.
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    return response.ok({
      code: StatusCodes.OK,
      status: StatusCodes[StatusCodes.OK],
      data: user.serialize(),
    })
  }

  /**
   * Logout user and revoke tokens.
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.noContent()
  }
}
