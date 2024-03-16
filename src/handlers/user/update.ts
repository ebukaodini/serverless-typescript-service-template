import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { response } from "../../middlewares";
import { UserDto } from "../../dtos/user.dto";
import { UserRepo } from "../../repos/user.repo";

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const data = UserDto.fromJson(JSON.parse(event.body!));
    const user = await UserRepo.update(event.pathParameters.userId, data);
    return response.success("User updated.", UserDto.toJson(user));
  } catch (error: any) {
    response.error("User not updated!", error.message);
  }
};
