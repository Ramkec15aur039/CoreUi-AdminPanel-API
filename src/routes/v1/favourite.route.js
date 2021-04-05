/** ***************** package Import ******************************************************** */

const express = require("express");

/** ***************** auth , validate from middleware Import ******************************************************** */

const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

/** ***************** favourite Validation from validation Import ******************************************************** */

const favouriteValidation = require("../../validations/favourite.validation");

/** ***************** favouriteController from controller Import ******************************************************** */

const favouriteController = require("../../controllers/favourite.controller");

const router = express.Router();

/*
path - /
router to create favourite and get favourite
post - to create favourite from getting favourite inputs
get - to show the gathered favourite details to admin or favourite
function auth - This function is to authenticate the valid favourite by tokens
function validate - This function is to validate the favourite input 
function favouriteController - This function is to create the favourite after the auth and validation completed

*/

router
  .route("/")
  .post(
    auth("manageFavourites"),
    validate(favouriteValidation.createFavourite),
    favouriteController.createFavourite
  )
  .get(
    auth("getFavourites"),
    validate(favouriteValidation.getFavourites),
    favouriteController.getFavourites
  );

/*
path - /:favouriteId
router to get favourite by id , update favourite by id and to delete favourite by id
post - to create favourite from getting favourite inputs
get - to show the gathered favourite details to admin or favourite
put - to update the collection 
delete - the delete is used to delete the favourite based on id given
function auth - This function is to authenticate the valid favourite by tokens
function validate - This function is to validate the favourite input 
function favouriteController - This function is to create the favourite after the auth and validation completed

*/

router
  .route("/:favouriteId")
  .get(
    auth("getFavourites"),
    validate(favouriteValidation.getFavourite),
    favouriteController.getFavourite
  )
  .put(
    auth("manageFavourites"),
    validate(favouriteValidation.updateFavourite),
    favouriteController.updateFavourite
  )
  .delete(
    auth("manageFavourites"),
    validate(favouriteValidation.deleteFavourite),
    favouriteController.deleteFavourite
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: Favourite management and retrieval
 */

/**
 * @swagger
 * path:
 *  /favourites:
 *    post:
 *      summary: Create a favourite
 *      description: Only admins can create other favourites.
 *      tags: [Favourites]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - userId
 *                - favouriteId
 *              properties:
 *                favouriteId:
 *                  type: string
 *                userId:
 *                  type: string
 *              example:
 *                userId: "1"
 *                favouriteId: "2"
 *
 *
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  favourite:
 *                    $ref: '#/components/schemas/Favourite'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all favourites
 *      description: Only admins can retrieve all favourites.
 *      tags: [Favourites]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: userId
 *          schema:
 *            type: string
 *          description: userId
 *        - in: query
 *          name: favouriteId
 *          schema:
 *            type: string
 *          description: Favourite id
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *          description: search
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
 *          description: Maximum number of favourites
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
 *                      $ref: '#/components/schemas/Favourite'
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
 *  /favourites/{id}:
 *    get:
 *      summary: Get a favourite
 *      description: Logged in favourites can fetch only their own favourite information. Only admins can fetch other favourites.
 *      tags: [Favourites]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Favourite id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Favourite'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    put:
 *      summary: Update a favourite
 *      description: Logged in favourites can only update their own information. Only admins can update other favourites.
 *      tags: [Favourites]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Favourite id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - userId
 *                - favouriteId
 *              properties:
 *                userId:
 *                  type: string
 *                favouriteId:
 *                  type: string
 *                  format: email
 *              example:
 *                userId: "1"
 *                favouriteId: "2"
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Favourite'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a favourite
 *      description: Logged in favourites can delete only themselves. Only admins can delete other favourites.
 *      tags: [Favourites]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Favourite id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
