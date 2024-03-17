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
    const users = await UserRepo.findAll(); 
    return response.success("All users.", UserDto.toArray(users));
  } catch (error: any) {
    return response.error("Users not found!", error.message);
  }
};
