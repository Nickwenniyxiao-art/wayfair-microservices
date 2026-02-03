import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import getDatabase from '../db/index.js';
import { payments, refunds, paymentHistory } from '../db/schema.js';
import logger from '../middleware/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  /**
   * 创建支付意向（Payment Intent）
   */
  async createPaymentIntent(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const db = getDatabase();

      const paymentId = uuidv4();
      const amountInCents = Math.round(data.amount * 100);

      // 创建 Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: data.currency || 'usd',
        metadata: {
          orderId: data.orderId,
          userId: data.userId,
          ...data.metadata,
        },
      });

      // 保存支付记录
      await db.insert(payments).values({
        id: paymentId,
        orderId: data.orderId,
        userId: data.userId,
        amount: String(data.amount),
        currency: data.currency || 'USD',
        paymentMethod: 'stripe',
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
      });

      // 记录历史
      await db.insert(paymentHistory).values({
        id: uuidv4(),
        paymentId,
        status: 'pending',
        message: 'Payment intent created',
      });

      logger.info(`Payment intent created: ${paymentIntent.id}`);

      return {
        paymentId,
        clientSecret: paymentIntent.client_secret,
        stripePaymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * 确认支付
   */
  async confirmPayment(data: {
    paymentId: string;
    stripePaymentIntentId: string;
  }) {
    try {
      const db = getDatabase();

      // 从 Stripe 获取支付意向状态
      const paymentIntent = await stripe.paymentIntents.retrieve(data.stripePaymentIntentId);

      let status = 'failed';
      if (paymentIntent.status === 'succeeded') {
        status = 'completed';
      } else if (paymentIntent.status === 'processing') {
        status = 'processing';
      }

      // 更新支付记录
      let chargeId: string | undefined;
      // 从 Stripe 获取支付记录的 charge ID
      if ((paymentIntent as any).charges && (paymentIntent as any).charges.data && (paymentIntent as any).charges.data.length > 0) {
        chargeId = (paymentIntent as any).charges.data[0].id;
      }
      await db.update(payments).set({
        status: status as any,
        stripeChargeId: chargeId,
      }).where(eq(payments.id, data.paymentId));

      // 记录历史
      await db.insert(paymentHistory).values({
        id: uuidv4(),
        paymentId: data.paymentId,
        status,
        message: `Payment ${status}`,
      });

      logger.info(`Payment confirmed: ${data.paymentId} -> ${status}`);

      return { success: true, status };
    } catch (error) {
      logger.error('Failed to confirm payment:', error);
      throw error;
    }
  }

  /**
   * 获取支付详情
   */
  async getPayment(paymentId: string) {
    try {
      const db = getDatabase();

      const paymentRecords = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);

      if (!paymentRecords || paymentRecords.length === 0) {
        throw new Error('Payment not found');
      }

      return paymentRecords[0];
    } catch (error) {
      logger.error('Failed to get payment:', error);
      throw error;
    }
  }

  /**
   * 创建退款
   */
  async createRefund(data: {
    paymentId: string;
    orderId: string;
    amount: number;
    reason?: string;
  }) {
    try {
      const db = getDatabase();

      // 获取支付记录
      const paymentRecords = await db.select().from(payments).where(eq(payments.id, data.paymentId)).limit(1);

      if (!paymentRecords || paymentRecords.length === 0) {
        throw new Error('Payment not found');
      }

      const payment = paymentRecords[0];

      if (payment.status !== 'completed') {
        throw new Error('Can only refund completed payments');
      }

      const paymentAmount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
      if (data.amount > paymentAmount) {
        throw new Error('Refund amount exceeds payment amount');
      }

      // 创建 Stripe 退款
      const stripeRefund = await stripe.refunds.create({
        charge: payment.stripeChargeId!,
        amount: Math.round(data.amount * 100),
        reason: data.reason as any,
      });

      // 保存退款记录
      const refundId = uuidv4();
      await db.insert(refunds).values({
        id: refundId,
        paymentId: data.paymentId,
        orderId: data.orderId,
        amount: String(data.amount),
        reason: data.reason,
        stripeRefundId: stripeRefund.id,
        status: stripeRefund.status === 'succeeded' ? 'completed' : 'pending',
      });

      logger.info(`Refund created: ${refundId}`);

      return {
        refundId,
        stripeRefundId: stripeRefund.id,
        status: stripeRefund.status,
      };
    } catch (error) {
      logger.error('Failed to create refund:', error);
      throw error;
    }
  }

  /**
   * 获取退款详情
   */
  async getRefund(refundId: string) {
    try {
      const db = getDatabase();

      const refundRecords = await db.select().from(refunds).where(eq(refunds.id, refundId)).limit(1);

      if (!refundRecords || refundRecords.length === 0) {
        throw new Error('Refund not found');
      }

      return refundRecords[0];
    } catch (error) {
      logger.error('Failed to get refund:', error);
      throw error;
    }
  }

  /**
   * 获取订单的支付列表
   */
  async getOrderPayments(orderId: string) {
    try {
      const db = getDatabase();

      const orderPayments = await db.select().from(payments).where(eq(payments.orderId, orderId)).orderBy(desc(payments.createdAt));

      return orderPayments;
    } catch (error) {
      logger.error('Failed to get order payments:', error);
      throw error;
    }
  }

  /**
   * 处理 Webhook
   */
  async handleWebhook(event: any) {
    try {
      const db = getDatabase();

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntentSucceeded = event.data.object;
          const paymentRecords = await db.select().from(payments).where(eq(payments.stripePaymentIntentId, paymentIntentSucceeded.id)).limit(1);

          if (paymentRecords && paymentRecords.length > 0) {
            const paymentRecord = paymentRecords[0];
            await db.update(payments).set({ status: 'completed' }).where(eq(payments.id, paymentRecord.id));
            await db.insert(paymentHistory).values({
              id: uuidv4(),
              paymentId: paymentRecord.id,
              status: 'completed',
              message: 'Payment succeeded via webhook',
            });
          }
          break;

        case 'payment_intent.payment_failed':
          const paymentIntentFailed = event.data.object;
          const failedPaymentRecords = await db.select().from(payments).where(eq(payments.stripePaymentIntentId, paymentIntentFailed.id)).limit(1);

          if (failedPaymentRecords && failedPaymentRecords.length > 0) {
            const failedPaymentRecord = failedPaymentRecords[0];
            await db.update(payments).set({ 
              status: 'failed',
              errorMessage: paymentIntentFailed.last_payment_error?.message,
            }).where(eq(payments.id, failedPaymentRecord.id));
            await db.insert(paymentHistory).values({
              id: uuidv4(),
              paymentId: failedPaymentRecord.id,
              status: 'failed',
              message: 'Payment failed via webhook',
            });
          }
          break;

        case 'charge.refunded':
          const chargeRefunded = event.data.object;
          const refundedPaymentRecords = await db.select().from(payments).where(eq(payments.stripeChargeId, chargeRefunded.id)).limit(1);

          if (refundedPaymentRecords && refundedPaymentRecords.length > 0) {
            const refundedPayment = refundedPaymentRecords[0];
            await db.update(payments).set({ status: 'refunded' }).where(eq(payments.id, refundedPayment.id));
          }
          break;
      }

      logger.info(`Webhook processed: ${event.type}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to handle webhook:', error);
      throw error;
    }
  }
}

export default new PaymentService();
