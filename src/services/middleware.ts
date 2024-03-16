import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { TMiddleware } from "../interfaces/TMiddleware";
import { THandler } from "../interfaces/THandler";

export class Middleware {
  static use(middlewares: TMiddleware[], handler: THandler) {
    return (
      event: APIGatewayProxyEvent,
      context: Context,
      callback: Function
    ) => {
      const chainMiddlewares = ([
        firstMiddleware,
        ...restOfMiddlewares
      ]: TMiddleware[]) => {
        if (firstMiddleware) {
          return (
            e: APIGatewayProxyEvent,
            c: Context
          ): Promise<APIGatewayProxyResult> => {
            try {
              return firstMiddleware(e, c, chainMiddlewares(restOfMiddlewares));
            } catch (error) {
              return Promise.reject(error);
            }
          };
        }

        return handler;
      };

      return chainMiddlewares(middlewares)(event, context)
        .then((result: any) => {
          if (callback) return callback(null, result);
        })
        .catch((error: any) => {
          if (callback) return callback(error, null);
        });
    };
  }
}
