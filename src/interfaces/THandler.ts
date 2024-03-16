import { APIGatewayProxyEvent, Context } from "aws-lambda";

export type THandler = (event: APIGatewayProxyEvent, context: Context) => any;
