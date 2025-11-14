package com.example.householdbook.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.householdbook.entity.Expense;
import com.example.householdbook.repository.ExpenseRepository;

@Service
@Transactional // トランザクション管理
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
	this.expenseRepository = expenseRepository;
    }

    /**
     * 全ての家計簿データを取得する
     * 
     * @return 家計簿データのリスト
     */
    public List<Expense> findAllExpenses() {
	return expenseRepository.findAll();
    }

    /**
     * IDを指定して家計簿データを取得する
     * 
     * @param id 家計簿ID
     * @return Optional<Expense>
     */
    public Optional<Expense> findExpenseById(Long id) {
	return expenseRepository.findById(id);
    }

    /**
     * 新しい家計簿データを保存する (Create / Update)
     * 
     * @param expense 保存する家計簿データ
     * @return 保存された家計簿データ
     */
    public Expense saveExpense(Expense expense) {
	return expenseRepository.save(expense);
    }

    /**
     * 家計簿データを更新する
     * 
     * @param id             更新対象の家計簿ID
     * @param updatedExpense 更新内容
     * @return 更新された家計簿データ (存在しない場合はOptional.empty())
     */
    public Optional<Expense> updateExpense(Long id, Expense updatedExpense) {
	return expenseRepository.findById(id).map(expense -> {
	    expense.setTransactionDate(updatedExpense.getTransactionDate());
	    expense.setDescription(updatedExpense.getDescription());
	    expense.setCategory(updatedExpense.getCategory());
	    expense.setAmount(updatedExpense.getAmount());
	    expense.setType(updatedExpense.getType());
	    return expenseRepository.save(expense);
	});
    }

    /**
     * IDを指定して家計簿データを削除する
     * 
     * @param id 削除対象の家計簿ID
     */
    public void deleteExpense(Long id) {
	expenseRepository.deleteById(id);
    }
}
