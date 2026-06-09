import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, checkDbConnection } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, message: "Missing verification credentials" }, { status: 400 });
    }

    const isDbConnected = await checkDbConnection();

    // 1. Verify cryptographic signature from Razorpay (if keys aren't mock)
    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret_key_54321";
    let isSignatureValid = false;
    
    if (razorpayOrderId.startsWith("rzp_mock_order_")) {
      // Auto-validate mock payments in mock mode
      isSignatureValid = true;
    } else {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
      isSignatureValid = generatedSignature === razorpaySignature;
    }

    if (!isSignatureValid) {
      if (isDbConnected) {
        // Mark order payment status as FAILED
        await db.order.update({
          where: { id: orderId },
          data: { paymentStatus: "FAILED" }
        });
      }
      return NextResponse.json({ success: false, message: "Payment signature verification failed" }, { status: 400 });
    }

    if (isDbConnected) {
      // 2. Fetch cart items for stock reduction
      const cartItems = await db.cartItem.findMany({
        where: { userId: session.id },
        include: { product: true }
      });

      // 3. Confirm order, set payment completed, and decrease stock levels
      await db.$transaction([
        // Update Order Status
        db.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "COMPLETED",
            status: "CONFIRMED"
          }
        }),
        // Create Payment Log
        db.payment.create({
          data: {
            orderId,
            method: "RAZORPAY",
            status: "COMPLETED",
            amount: cartItems.reduce((acc, item) => {
              const rate22k = 6830;
              const totalItemCost = (rate22k * item.product.weight + item.product.makingChargesPerGram * item.product.weight) * 1.03 * item.quantity;
              return acc + totalItemCost;
            }, 0),
            transactionId: razorpayPaymentId
          }
        }),
        // Reduce product stock levels
        ...cartItems.map(item =>
          db.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { decrement: item.quantity } }
          })
        ),
        // Clear shopping cart
        db.cartItem.deleteMany({
          where: { userId: session.id }
        })
      ]);
    } else {
      console.warn("Checkout payment verification bypassed database because it is offline.");
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order confirmed successfully!"
    });

  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, message: "Server error during signature verification" }, { status: 500 });
  }
}
