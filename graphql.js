'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphql = graphql;

var _parser = require('./language/parser');

var _validate = require('./validation/validate');

var _execute = require('./execution/execute');

/**
 * This is the primary entry point function for fulfilling GraphQL operations
 * by parsing, validating, and executing a GraphQL document along side a
 * GraphQL schema.
 *
 * More sophisticated GraphQL servers, such as those which persist queries,
 * may wish to separate the validation and execution phases to a static time
 * tooling step, and a server runtime step.
 *
 * Accepts either an object with named arguments, or individual arguments:
 *
 * schema:
 *    The GraphQL type system to use when validating and executing a query.
 * source:
 *    A GraphQL language formatted string representing the requested operation.
 * rootValue:
 *    The value provided as the first argument to resolver functions on the top
 *    level type (e.g. the query object type).
 * variableValues:
 *    A mapping of variable name to runtime value to use for all variables
 *    defined in the requestString.
 * operationName:
 *    The name of the operation to use if requestString contains multiple
 *    possible operations. Can be omitted if requestString contains only
 *    one operation.
 * fieldResolver:
 *    A resolver function to use when one is not provided by the schema.
 *    If not provided, the default field resolver is used (which looks for a
 *    value or method on the source value with the field's name).
 */

/* eslint-disable no-redeclare */
function graphql(argsOrSchema, source, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // Extract arguments from object args if provided.
  return arguments.length === 1 ? graphqlImpl(argsOrSchema) : graphqlImpl({
    schema: argsOrSchema,
    source: source,
    rootValue: rootValue,
    contextValue: contextValue,
    variableValues: variableValues,
    operationName: operationName,
    fieldResolver: fieldResolver
  });
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function graphqlImpl(args) {
  return new Promise(function (resolve) {
    // Parse
    var document = void 0;
    try {
      document = (0, _parser.parse)(args.source);
    } catch (syntaxError) {
      return resolve({ errors: [syntaxError] });
    }

    // Validate
    var validationErrors = (0, _validate.validate)(args.schema, document);
    if (validationErrors.length > 0) {
      return resolve({ errors: validationErrors });
    }

    // Execute
    resolve((0, _execute.execute)(args.schema, document, args.rootValue, args.contextValue, args.variableValues, args.operationName, args.fieldResolver));
  });
}