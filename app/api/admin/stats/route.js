import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Event from '@/src/models/event';
import Users from '@/src/models/Users';
import Purchase from '@/src/models/purchase';

export async function GET() {
  try {
    await connectToMongoose();

    // Get total events
    const totalEvents = await Event.countDocuments();

    // Get pending events (events that haven't happened yet - date is in the future)
    const now = new Date();
    const pendingEvents = await Event.countDocuments({
      date: { $gte: now.toISOString().split('T')[0] }
    });

    // Get total users
    const totalUsers = await Users.countDocuments();

    // Get total sales from purchases
    const salesData = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalCommissions: { $sum: { $multiply: ['$totalAmount', 0.1] } } // 10% commission
        }
      }
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;
    const totalCommissions = salesData.length > 0 ? salesData[0].totalCommissions : 0;

    // Calculate percentage changes (comparing with previous month)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const currentMonthEvents = await Event.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    const previousMonthEvents = await Event.countDocuments({
      createdAt: { 
        $gte: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() - 1, 1),
        $lt: oneMonthAgo 
      }
    });

    const eventChangePercent = previousMonthEvents > 0 
      ? Math.round(((currentMonthEvents - previousMonthEvents) / previousMonthEvents) * 100)
      : currentMonthEvents > 0 ? 100 : 0;

    const currentMonthUsers = await Users.countDocuments({
      creadoEn: { $gte: oneMonthAgo }
    });

    const previousMonthUsers = await Users.countDocuments({
      creadoEn: { 
        $gte: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() - 1, 1),
        $lt: oneMonthAgo 
      }
    });

    const userChangePercent = previousMonthUsers > 0 
      ? Math.round(((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100)
      : currentMonthUsers > 0 ? 100 : 0;

    const currentMonthSales = await Purchase.aggregate([
      {
        $match: {
          createdAt: { $gte: oneMonthAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const previousMonthSales = await Purchase.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() - 1, 1),
            $lt: oneMonthAgo 
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const currentSales = currentMonthSales.length > 0 ? currentMonthSales[0].total : 0;
    const previousSales = previousMonthSales.length > 0 ? previousMonthSales[0].total : 0;

    const salesChangePercent = previousSales > 0 
      ? Math.round(((currentSales - previousSales) / previousSales) * 100)
      : currentSales > 0 ? 100 : 0;

    const commissionChangePercent = Math.round(salesChangePercent * 0.8); // Rough estimate

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        pendingEvents,
        totalUsers,
        totalSales,
        totalCommissions,
        changes: {
          events: eventChangePercent,
          users: userChangePercent,
          sales: salesChangePercent,
          commissions: commissionChangePercent
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching statistics' },
      { status: 500 }
    );
  }
} 