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
      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = {
          total: 0,
          estimated: 0,
          actual: 0,
          count: 0,
        };
      }
      categoryMap[exp.category].total += exp.amount;
      categoryMap[exp.category].count += 1;
      if (exp.isEstimated) {
        categoryMap[exp.category].estimated += exp.amount;
      } else {
        categoryMap[exp.category].actual += exp.amount;
      }
    }

    const byCategory = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      amount: Math.round(data.total * 100) / 100,
      estimated: Math.round(data.estimated * 100) / 100,
      actual: Math.round(data.actual * 100) / 100,
      count: data.count,
      percentage: totalSpent > 0 ? Math.round((data.total / totalSpent) * 100) : 0,
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

    // Extract or calculate AI-defined money separation per category
    let aiBudgetPlan = null;
    if (trip.notes) {
      try {
        const parsed = JSON.parse(trip.notes);
        if (parsed && parsed.aiBudgetPlan) {
          aiBudgetPlan = parsed.aiBudgetPlan;
        }
      } catch (e) {
        // notes is plain string
      }
    }

    if (!aiBudgetPlan) {
      const estimatedItems = expenses.filter((e) => e.isEstimated);
      if (estimatedItems.length > 0) {
        aiBudgetPlan = {};
        for (const item of estimatedItems) {
          aiBudgetPlan[item.category] = (aiBudgetPlan[item.category] || 0) + item.amount;
        }
        aiBudgetPlan.totalEstimated = estimatedItems.reduce((sum, e) => sum + e.amount, 0);
      }
    }

    if (!aiBudgetPlan) {
      const baseTotal = totalBudget > 0 ? totalBudget : (trip.currency === 'INR' ? 28000 : 1200);
      aiBudgetPlan = {
        transportation: Math.round(baseTotal * 0.25),
        accommodation: Math.round(baseTotal * 0.35),
        food: Math.round(baseTotal * 0.22),
        activities: Math.round(baseTotal * 0.13),
        miscellaneous: Math.round(baseTotal * 0.05),
        totalEstimated: baseTotal,
      };
    }

    const categoryDefinitions = [
      { category: 'transportation', label: 'Transportation', icon: '✈️', color: '#3B82F6' },
      { category: 'accommodation', label: 'Accommodation', icon: '🏨', color: '#8B5CF6' },
      { category: 'food', label: 'Food & Dining', icon: '🍜', color: '#F59E0B' },
      { category: 'activities', label: 'Activities & Sightseeing', icon: '🎭', color: '#22D3EE' },
      { category: 'shopping', label: 'Shopping', icon: '🛍️', color: '#EC4899' },
      { category: 'miscellaneous', label: 'Miscellaneous & Contingency', icon: '📦', color: '#94A3B8' },
    ];

    const actualByCategory = {};
    for (const exp of expenses.filter((e) => !e.isEstimated)) {
      actualByCategory[exp.category] = (actualByCategory[exp.category] || 0) + exp.amount;
    }

    const aiTotal = Number(aiBudgetPlan.totalEstimated) || totalBudget || 0;

    const aiMoneySeparation = {
      totalAllocated: aiTotal,
      currency: trip.currency,
      categories: categoryDefinitions.map((catDef) => {
        const aiAllocated = Math.round((Number(aiBudgetPlan[catDef.category]) || 0) * 100) / 100;
        const actualSpent = Math.round((actualByCategory[catDef.category] || 0) * 100) / 100;
        const remaining = Math.round((aiAllocated - actualSpent) * 100) / 100;
        const percentage = aiTotal > 0 ? Math.round((aiAllocated / aiTotal) * 100) : 0;
        const spentRatio = aiAllocated > 0 ? Math.round((actualSpent / aiAllocated) * 100) : 0;

        let status = 'unspent';
        if (actualSpent > aiAllocated && aiAllocated > 0) {
          status = 'exceeded';
        } else if (actualSpent > 0) {
          status = 'on_track';
        }

        return {
          category: catDef.category,
          label: catDef.label,
          icon: catDef.icon,
          color: catDef.color,
          aiAllocated,
          actualSpent,
          remaining,
          percentage,
          spentRatio,
          status,
        };
      }),
    };

    return successResponse(res, {
      tripId,
      currency: trip.currency,
      totalBudget: totalBudget > 0 ? totalBudget : (aiTotal > 0 ? aiTotal : 0),
      totalSpent: Math.round(totalSpent * 100) / 100,
      remainingBudget: remainingBudget != null ? Math.round(remainingBudget * 100) / 100 : null,
      estimatedSpent: Math.round(estimated * 100) / 100,
      actualSpent: Math.round(actual * 100) / 100,
      byCategory,
      dailySpending,
      expenseCount: expenses.length,
      aiMoneySeparation,
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
