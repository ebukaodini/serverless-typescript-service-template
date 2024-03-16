import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ValidationError, validate } from "class-validator";
import { response } from "../middlewares/response";
import { HttpStatusCode } from "axios";

export const validator = (Dto: any, group: string) => {
  return async (event: APIGatewayProxyEvent, context: Context, next: any) => {
    try {
      if (!event.body) {
        return response.error(
          "Request body is empty",
          undefined,
          HttpStatusCode.UnprocessableEntity
        );
      }

      const dtoData = Dto.fromJson(JSON.parse(event.body!));
      const errors = await validate(dtoData, {
        groups: [group],
        validationError: {
          target: false,
          value: false,
        },
        strictGroups: true,
      });

      // Handle validation error
      if (errors.length > 0) {
        const validationErrors = mapErrors(errors);
        return response.error(
          "Validation failed",
          validationErrors,
          HttpStatusCode.UnprocessableEntity
        );
      }

      context.clientContext.Custom = {
        ...context.clientContext.Custom,
        validData: dtoData,
      };
      return await next(event, context);
    } catch (error: any) {
      return response.error(
        "Internal server error",
        error.message,
        HttpStatusCode.InternalServerError
      );
    }
  };
};

const mapErrors = (errors: ValidationError[]) => {
  const mappedErrors: any = {};

  for (const error of errors) {
    const { property, children, constraints } = error;

    if (constraints) {
      mappedErrors[property] = Object.values(constraints)[0];
    } else if (children?.length! > 0) {
      mappedErrors[property] = mapErrors(children!);
    }
  }

  return mappedErrors;
};
