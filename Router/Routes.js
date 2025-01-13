const express = require('express');
const router = express.Router();

// Import controller functions
const ctrlregisterData = require('../Controller/Register');
const ctrlcareerData = require('../Controller/Career');
const ctrlcreateOrder = require('../Controller/Payment');
const ctrlpurchaseHistory = require('../Controller/BuyingHistory'); // New controller for purchase history

/**
 * @swagger
 *  components:
 *    schemas:
 *        PurchaseHistory:
 *                type: object
 *                properties:
 *                    userId:
 *                          type: string
 *                    items:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                  name:
 *                                      type: string
 *                                  price:
 *                                      type: number
 *                                  quantity:
 *                                      type: number
 *                                  purchaseDate:
 *                                      type: string
 *                                      format: date-time
 *                                  image:
 *                                      type: string
 */

/**
 * @swagger
 * /api/purchase-history:
 *  post:
 *      summary: Save purchase history
 *      description: Save user purchase history to the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                    $ref: '#components/schemas/PurchaseHistory'
 *      responses:
 *          201:
 *              description: Purchase history saved successfully
 *          400:
 *              description: Invalid request data
 *          500:
 *              description: Server error
 */

/**
 * @swagger
 * /api/purchase-history:
 *  get:
 *      summary: Get purchase history
 *      description: Retrieve user purchase history from the database
 *      parameters:
 *          - in: query
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID to fetch history for
 *      responses:
 *          200:
 *              description: Successful response with purchase history
 *          400:
 *              description: User ID is required
 *          500:
 *              description: Server error
 */

// Existing routes
router.post('/api/registerData', ctrlregisterData.Register);
router.post('/api/careerData', ctrlcareerData.Career);
router.post('/payment/create-order', ctrlcreateOrder.createOrder);

// Purchase history routes
router.post('/api/purchase-history', ctrlpurchaseHistory.PostHistory);
router.get('/api/purchase-history', ctrlpurchaseHistory.GetHistory);

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
