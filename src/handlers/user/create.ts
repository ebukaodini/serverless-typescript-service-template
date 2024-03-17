import "reflect-metadata";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response, validator } from "../../middlewares";
import { UserDto } from "../../dtos/user.dto";
import { UserRepo } from "../../repos/user.repo";
import { Middleware } from "../../services/middleware";

export const handler = Middleware.use(
  [validator(UserDto, "create")],
  async (
    event: APIGatewayProxyEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const data = UserDto.fromJson(JSON.parse(event.body!));
      const user = await UserRepo.create(data);
      return response.success("User created.", UserDto.toJson(user));
    } catch (error: any) {
      return response.error("User not created!", error.message);
    }
  }
);
