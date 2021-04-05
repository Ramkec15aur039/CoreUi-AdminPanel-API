/** ***************** package Import ******************************************************** */

const express = require("express");

/** ***************** auth , validate from middleware Import ******************************************************** */

// const auth = require("../../middleware/auth");

/** ***************** logs Validation from validation Import ******************************************************** */

/** ***************** logsController from controller Import ******************************************************** */

const updateLogsController = require("../../controllers/updateLogger.controller");

const router = express.Router();

/*
path - /
router to create logs and get logs
post - to create logs from getting logs inputs
get - to show the gathered logs details to admin or user
function auth - This function is to authenticate the valid logs by tokens
function validate - This function is to validate the logs input 
function logsController - This function is to create the logs after the auth and validation completed

*/

router.route("/").get(updateLogsController.getUpdateLogger);
router.route("/undo").get(updateLogsController.getUndoLogger);

/*
path - /:logsId
router to get logs by id , update logs by id and to delete logs by id
post - to create logs from getting logs inputs
get - to show the gathered logs details to admin or logs
put - to update the collection 
delete - the delete is used to delete the logs based on id given
function auth - This function is to authenticate the valid logs by tokens
function validate - This function is to validate the logs input 
function logsController - This function is to create the logs after the auth and validation completed

*/
// router
//   .route("/:logsId")
//   .get(
//     auth("getLogs"),
//     logsController.getLogs
//   )
//   .put(
//     auth("manageLogs"),
//     logsController.updateLogs
//   )
//   .delete(
//     auth("manageLogs"),
//     logsController.deleteLogs
//   );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: updateLogs
 *   description: logs management and retrieval
 */

/**
 * @swagger
 * path:
 *  /updateLogs:
 *    get:
 *      summary: Get all logss
 *      description: Only admins can retrieve all users.
 *      tags: [updateLogs]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: action
 *          schema:
 *            type: string
 *          description: action
 *        - in: query
 *          name: collectionName
 *          schema:
 *            type: string
 *          description: collection
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of users
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Logs'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /updateLogs/undo:
 *    get:
 *      summary: Get all logss
 *      description: Only admins can retrieve all users.
 *      tags: [updateLogs]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: userId
 *          schema:
 *            type: string
 *          description: userId
 *        - in: query
 *          name: _id
 *          schema:
 *            type: object
 *          description: undo id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Logs'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */
