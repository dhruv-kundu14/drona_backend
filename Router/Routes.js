const express = require('express');
const router = express.Router();

// Import controller functions
const ctrlregisterData = require('../Controller/Register');
const ctrlcareerData = require('../Controller/Career');
const ctrlcreateOrder = require('../Controller/Payment');


/**
 * @swagger
 *  components:
 *    schemas:
 *        SchemaValidator:
 *                type: object
 *                properties:
 *                    schemaShortCode:
 *                          type: string
 *                    dataJson:
 *                          type: object
 */

/**
 * @swagger
 * /compliance-api/validateSchema:
 *  post:
 *      summary: Used to validate schema against data
 *      description: Validates schema against input data
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                    $ref: '#components/schemas/SchemaValidator'
 *      responses:
 *          200:
 *              description: Successful response
 */

// Route for fetching products (GET request)

router.post('/api/registerData', ctrlregisterData.Register);
router.post('/api/careerData', ctrlcareerData.Career);

// Payment route
router.post('/payment/create-order', ctrlcreateOrder.createOrder);


// Example route handler
router.get('/example', (req, res) => {
  res.json({
    message: 'This is an example endpoint',
    status: 200,
  });
});

// XML Response Route
router.get('/GetBit', (req, res) => {
  res.type('application/xml');
  res.send(
    `<Zero>
      <First>SEND</First>
      <Second>
        <Third>SEND</Third>
        <Fourth>
          <Fifth>SEND</Fifth>
          <Six>
            <seven>SEND</seven>
          </Six>
        </Fourth>
      </Second>
    </Zero>`
  );
});

module.exports = router;
