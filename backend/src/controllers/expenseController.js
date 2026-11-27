const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: 'desc' },
    });

    return successResponse(res, { expenses });
  } catch (err) {
    next(err);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { tripId, category, title, description, amount, currency, date, isEstimated, receiptUrl } = req.body;

    if (!tripId || !title || amount == null || !category) {
      return errorResponse(res, 'tripId, category, title, and amount are required', 400);
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);

    const expense = await prisma.expense.create({
      data: {
        tripId,
        userId: req.user.id,
        category,
        title,
        description,
        amount: parseFloat(amount),
        currency: currency || trip.currency || 'USD',
        date: date ? new Date(date) : new Date(),
        isEstimated: Boolean(isEstimated),
        receiptUrl,
      },
    });

    return successResponse(res, { expense }, 'Expense logged successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const existing = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return errorResponse(res, 'Expense not found', 404);

    const { amount, date, ...rest } = req.body;
    const updated = await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
      },
    });

    return successResponse(res, { expense: updated }, 'Expense updated');
  } catch (err) {
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const existing = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return errorResponse(res, 'Expense not found', 404);

    await prisma.expense.delete({ where: { id: req.params.id } });
    return successResponse(res, null, 'Expense deleted');
  } catch (err) {
    next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) return errorResponse(res, 'Trip not found', 404);

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: 'asc' },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const estimated = expenses.filter((e) => e.isEstimated).reduce((sum, e) => sum + e.amount, 0);
    const actual = expenses.filter((e) => !e.isEstimated).reduce((sum, e) => sum + e.amount, 0);

    const categoryMap = {};
    for (const exp of expenses) {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    }

    const byCategory = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }));

    // Daily spending grouping
    const dateMap = {};
    for (const exp of expenses) {
      const day = exp.date ? new Date(exp.date).toISOString().split('T')[0] : 'Undated';
      dateMap[day] = (dateMap[day] || 0) + exp.amount;
    }

    const dailySpending = Object.entries(dateMap)
      .map(([date, amount]) => ({
        date,
        amount: Math.round(amount * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalBudget = trip.budget || 0;
    const remainingBudget = totalBudget > 0 ? totalBudget - totalSpent : null;

    return successResponse(res, {
      tripId,
      currency: trip.currency,
      totalBudget,
      totalSpent: Math.round(totalSpent * 100) / 100,
      remainingBudget: remainingBudget != null ? Math.round(remainingBudget * 100) / 100 : null,
      estimatedSpent: Math.round(estimated * 100) / 100,
      actualSpent: Math.round(actual * 100) / 100,
      byCategory,
      dailySpending,
      expenseCount: expenses.length,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getAnalytics,
};
