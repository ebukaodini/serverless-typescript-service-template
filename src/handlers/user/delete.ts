import "reflect-metadata";
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
    const user = await UserRepo.delete(event.pathParameters.userId);
    return response.success("User deleted.", UserDto.toJson(user));
  } catch (error: any) {
    return response.error("User not deleted!", error.message);
  }
};
