/** ***************** package Import ******************************************************** */

const express = require("express");

/** ***************** auth , validate from middleware Import ******************************************************** */

const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

/** ***************** user Validation from validation Import ******************************************************** */

const adminValidation = require("../../validations/admin.validation");

/** ***************** userController from controller Import ******************************************************** */

const adminController = require("../../controllers/admin.controller");

const router = express.Router();

/*
path - /
router to create user and get user
post - to create user from getting user inputs
get - to show the gathered user details to admin or user
function auth - This function is to authenticate the valid user by tokens
function validate - This function is to validate the user input 
function userController - This function is to create the user after the auth and validation completed

*/

router
  .route("/filter")
  .post(
    auth("manageUsers"),
    validate(adminValidation.filterUsers),
    adminController.filterUsers
  );
router
  .route("/")
  .post(
    auth("manageUsers"),
    validate(adminValidation.createUser),
    adminController.createUser
  )
  .get(
    auth("getUsers"),
    validate(adminValidation.getUsers),
    adminController.getUsers
  );

/*
path - /:userId
router to get user by id , update user by id and to delete user by id
post - to create user from getting user inputs
get - to show the gathered user details to admin or user
put - to update the collection 
delete - the delete is used to delete the user based on id given
function auth - This function is to authenticate the valid user by tokens
function validate - This function is to validate the user input 
function userController - This function is to create the user after the auth and validation completed

*/

router
  .route("/:userId")
  .get(
    auth("getUsers"),
    validate(adminValidation.getUser),
    adminController.getUser
  )
  .put(
    auth("manageUsers"),
    validate(adminValidation.updateUser),
    adminController.updateUser
  )
  .delete(
    auth("manageUsers"),
    validate(adminValidation.deleteUser),
    adminController.deleteUser
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: User management and retrieval
 */

/**
 * @swagger
 * path:
 *  /admin/users:
 *    post:
 *      summary: Create a user
 *      description: Only admins can create other users.
 *      tags: [Admin]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - userName
 *                - email
 *                - password
 *                - role
 *                - firstName
 *                - lastName
 *                - mobileNumber
 *                - street
 *                - city
 *                - location
 *                - isActive
 *                - isDeleted
 *                - createdBy
 *                - updatedBy
 *                - role
 *              properties:
 *                userName:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *                role:
 *                   type: string
 *                   enum: [user, admin, sponsor, resource, approver, lead]
 *                mobileNumber:
 *                   type: string
 *                street:
 *                   type: string
 *                city:
 *                   type: string
 *                state:
 *                   type: string
 *                location:
 *                   type: string
 *              example:
 *                firstName: praveen
 *                lastName: s
 *                userName: praveens
 *                email: praveen@example.com
 *                password: password1
 *                role: ["user"]
 *                mobileNumber: "1234567890"
 *                street: 2311  Sundown Lane
 *                city: Austin
 *                state: Texas
 *                location: location
 *                specialty: "cardio"
 *                pager: "12481234567"
 *                fax: "13235551234@efaxsend.com"
 *                officePhone: "0420-157351"

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
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all users
 *      description: Only admins can retrieve all users.
 *      tags: [Admin]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: userName
 *          schema:
 *            type: string
 *          description: userName
 *        - in: query
 *          name: role
 *          schema:
 *            type: string
 *          description: User role
 *        - in: query
 *          name: mobileNumber
 *          schema:
 *            type: string
 *          description: mobile number
 *        - in: query
 *          name: specialty
 *          schema:
 *            type: string
 *          description: specialty
 *        - in: query
 *          name: pager
 *          schema:
 *            type: string
 *          description: pager
 *        - in: query
 *          name: fax
 *          schema:
 *            type: string
 *          description: fax
 *        - in: query
 *          name: officePhone
 *          schema:
 *            type: string
 *          description: office phone
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
 *                      $ref: '#/components/schemas/User'
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
 *  /admin/users/{id}:
 *    get:
 *      summary: Get a user
 *      description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *      tags: [Admin]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    put:
 *      summary: Update a user
 *      description: Logged in users can only update their own information. Only admins can update other users.
 *      tags: [Admin]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - email
 *                - password
 *                - role
 *                - userName
 *                - firstName
 *                - lastName
 *                - mobileNumber
 *                - street
 *                - city
 *                - location
 *                - isActive
 *                - isDeleted
 *                - createdBy
 *                - updatedBy
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *                role:
 *                   type: string
 *                   enum: [user, admin, sponsor, resource, approver, lead]
 *                mobileNumber:
 *                   type: string
 *                street:
 *                   type: string
 * 
 *                city:
 *                   type: string
 *                state:
 *                   type: string
 *                location:
 *                   type: string
 *              example:
 *                userName: praveens
 *                email: fake@example.com
 *                firstName: robbin
 *                lastName: singh
 *                password: password1
 *                role: ["user"]
 *                mobileNumber: "9999999999"
 *                street: aaaa
 *                city: bbbb
 *                state: cccc
 *                location: dddd
 *                specialty: "cardio"
 *                pager: "12481234567"
 *                fax: "13235551234@efaxsend.com"
 *                officePhone: "0420-157351"


 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
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
 *      summary: Delete a user
 *      description: Logged in users can delete only themselves. Only admins can delete other users.
 *      tags: [Admin]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
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

/**
 * @swagger
 * path:
 *  /admin/users/filter:
 *    post:
 *      summary: Create a user
 *      description: Only admins can create other users.
 *      tags: [Admin]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - userName
 *                - email
 *                - role
 *                - mobileNumber
 *                - isAdmin
 *                - pcp
 *                - isActive
 *                - isDeleted
 *                - createdBy
 *                - updatedBy
 *                - role
 *              properties:
 *                mobileNumber:
 *                   type: string
 *              example:
 *                email: ["@farallonmed.com","@pacificmedicalgroup.org"]
 *                pcp: true
 *                isAdmin: false

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
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */
