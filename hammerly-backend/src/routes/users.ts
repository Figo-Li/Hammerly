import { Router, Request, Response } from 'express';
import { getOne, getAll, runQuery, runInsert } from '../db/database.js';
import { hashPassword, comparePassword } from '../utils/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  avatarImage: string;
  createdAt: string;
}

interface PaymentMethod {
  id: number;
  user_id: number;
  cardType: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: number;
  billingAddress: string;
  billingCity: string;
  billingProvince: string;
  billingPostalCode: string;
  billingCountry: string;
  createdAt: string;
}

// ─── GET current user profile ─────────────────────────────────
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await getOne<User>(
      'SELECT id, firstName, lastName, email, phone, avatarImage, createdAt FROM users WHERE id = ?',
      [req.user!.userId]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── PUT update profile info ──────────────────────────────────
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       409:
 *         description: Email already in use
 */
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const userId = req.user!.userId;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'First name, last name, and email are required' });
    }

    // Check if email is taken by another user
    const existing = await getOne<User>('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use by another account' });
    }

    await runQuery(
      'UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [firstName, lastName, email, phone || '', userId]
    );

    const updated = await getOne<User>(
      'SELECT id, firstName, lastName, email, phone, avatarImage, createdAt FROM users WHERE id = ?',
      [userId]
    );

    res.json({ success: true, message: 'Profile updated successfully', user: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── PUT change password ──────────────────────────────────────
/**
 * @swagger
 * /api/users/profile/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change user password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Current password is incorrect
 */
router.put('/profile/password', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user!.userId;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    const user = await getOne<User>('SELECT password FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashed = await hashPassword(newPassword);
    await runQuery('UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [hashed, userId]);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── PUT update avatar ────────────────────────────────────────
/**
 * @swagger
 * /api/users/profile/avatar:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user avatar image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarImage:
 *                 type: string
 *                 description: Base64-encoded image or URL
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 */
router.put('/profile/avatar', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { avatarImage } = req.body;
    const userId = req.user!.userId;

    if (!avatarImage) {
      return res.status(400).json({ success: false, message: 'Avatar image is required' });
    }

    await runQuery('UPDATE users SET avatarImage = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [avatarImage, userId]);

    res.json({ success: true, message: 'Avatar updated successfully', avatarImage });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── DELETE remove avatar ─────────────────────────────────────
/**
 * @swagger
 * /api/users/profile/avatar:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove user avatar image
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed successfully
 */
router.delete('/profile/avatar', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    await runQuery("UPDATE users SET avatarImage = '', updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [userId]);
    res.json({ success: true, message: 'Avatar removed successfully' });
  } catch (error) {
    console.error('Remove avatar error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── GET payment methods ──────────────────────────────────────
/**
 * @swagger
 * /api/users/profile/payment-methods:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user payment methods
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 */
router.get('/profile/payment-methods', authMiddleware, async (req: Request, res: Response) => {
  try {
    const methods = await getAll<PaymentMethod>(
      'SELECT * FROM payment_methods WHERE user_id = ? ORDER BY isDefault DESC, createdAt DESC',
      [req.user!.userId]
    );
    res.json({ success: true, paymentMethods: methods });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── POST add payment method ──────────────────────────────────
/**
 * @swagger
 * /api/users/profile/payment-methods:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add a new payment method
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardType:
 *                 type: string
 *               lastFour:
 *                 type: string
 *               expiryMonth:
 *                 type: integer
 *               expiryYear:
 *                 type: integer
 *               cardholderName:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               billingAddress:
 *                 type: string
 *               billingCity:
 *                 type: string
 *               billingProvince:
 *                 type: string
 *               billingPostalCode:
 *                 type: string
 *               billingCountry:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment method added successfully
 */
router.post('/profile/payment-methods', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const {
      cardType, lastFour, expiryMonth, expiryYear, cardholderName,
      isDefault, billingAddress, billingCity, billingProvince, billingPostalCode, billingCountry
    } = req.body;

    if (!cardType || !lastFour || !expiryMonth || !expiryYear || !cardholderName) {
      return res.status(400).json({ success: false, message: 'Card type, last four digits, expiry, and cardholder name are required' });
    }

    // If this card is set as default, un-default all others
    if (isDefault) {
      await runQuery('UPDATE payment_methods SET isDefault = 0 WHERE user_id = ?', [userId]);
    }

    // If this is the first card, make it default
    const existingCards = await getAll<PaymentMethod>('SELECT id FROM payment_methods WHERE user_id = ?', [userId]);
    const makeDefault = existingCards.length === 0 ? 1 : (isDefault ? 1 : 0);

    const id = await runInsert(
      `INSERT INTO payment_methods (user_id, cardType, lastFour, expiryMonth, expiryYear, cardholderName, isDefault, billingAddress, billingCity, billingProvince, billingPostalCode, billingCountry)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, cardType, lastFour, expiryMonth, expiryYear, cardholderName, makeDefault,
       billingAddress || '', billingCity || '', billingProvince || '', billingPostalCode || '', billingCountry || '']
    );

    const newMethod = await getOne<PaymentMethod>('SELECT * FROM payment_methods WHERE id = ?', [id]);

    res.status(201).json({ success: true, message: 'Payment method added successfully', paymentMethod: newMethod });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── DELETE remove payment method ─────────────────────────────
/**
 * @swagger
 * /api/users/profile/payment-methods/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a payment method
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment method deleted
 *       404:
 *         description: Payment method not found
 */
router.delete('/profile/payment-methods/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const methodId = req.params.id;

    const method = await getOne<PaymentMethod>(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?',
      [methodId, userId]
    );

    if (!method) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    await runQuery('DELETE FROM payment_methods WHERE id = ? AND user_id = ?', [methodId, userId]);

    // If deleted card was default, make the next one default
    if (method.isDefault) {
      const next = await getOne<PaymentMethod>(
        'SELECT id FROM payment_methods WHERE user_id = ? ORDER BY createdAt DESC LIMIT 1',
        [userId]
      );
      if (next) {
        await runQuery('UPDATE payment_methods SET isDefault = 1 WHERE id = ?', [next.id]);
      }
    }

    res.json({ success: true, message: 'Payment method deleted' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── PUT set default payment method ───────────────────────────
/**
 * @swagger
 * /api/users/profile/payment-methods/{id}/default:
 *   put:
 *     tags:
 *       - Users
 *     summary: Set a payment method as default
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Default payment method updated
 *       404:
 *         description: Payment method not found
 */
router.put('/profile/payment-methods/:id/default', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const methodId = req.params.id;

    const method = await getOne<PaymentMethod>(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?',
      [methodId, userId]
    );

    if (!method) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    await runQuery('UPDATE payment_methods SET isDefault = 0 WHERE user_id = ?', [userId]);
    await runQuery('UPDATE payment_methods SET isDefault = 1 WHERE id = ?', [methodId]);

    res.json({ success: true, message: 'Default payment method updated' });
  } catch (error) {
    console.error('Set default payment method error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── GET user by ID (public) ──────────────────────────────────
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User information retrieved
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getOne<Omit<User, 'email' | 'password'>>(
      'SELECT id, firstName, lastName, avatarImage, createdAt FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── GET my bids ───────────────────────────────────────────────
/**
 * @swagger
 * /api/users/my-bids:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all auctions the specified user has placed bids for
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve bids for
 *     responses:
 *       200:
 *         description: Bids retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 bids:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       auctionId:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       startPrice:
 *                         type: number
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       bidAmount:
 *                         type: number
 *       400:
 *         description: Missing userId in query parameters
 */
router.get('/my-bids', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId in query parameters' });
    }

    const bids = await getAll(
      `SELECT a.id AS auctionId, a.title, a.description, a.startPrice, a.endDate, b.amount AS bidAmount
       FROM bids b
       JOIN auctions a ON b.auction_id = a.id
       WHERE b.bidder_id = ?
       ORDER BY a.endDate DESC`,
      [userId]
    );

    res.json({ success: true, bids });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── GET user published auctions ───────────────────────────────
/**
 * @swagger
 * /api/users/my-auctions:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all auctions published by the current user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Auctions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 auctions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       startPrice:
 *                         type: number
 *                       currentBid:
 *                         type: number
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/my-auctions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const auctions = await getAll(
      `SELECT id, title, description, startPrice, currentBid, startTime, endDate
       FROM auctions
       WHERE seller_id = ?
       ORDER BY createdAt DESC`,
      [userId]
    );

    res.json({ success: true, auctions });
  } catch (error) {
    console.error('Get user published auctions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
