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
    const user = await UserRepo.findOne(event.pathParameters.userId);
    return response.success("User details.", UserDto.toJson(user));
  } catch (error: any) {
    response.error("User not found!", error.message);
  }
};
