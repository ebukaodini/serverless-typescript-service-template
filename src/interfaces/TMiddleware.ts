import { APIGatewayProxyEvent, Context } from "aws-lambda";

export type TMiddleware = (
  event: APIGatewayProxyEvent,
  context: Context,
  next: any
) => any;
