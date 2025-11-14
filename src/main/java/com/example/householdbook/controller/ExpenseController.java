package com.example.householdbook.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.householdbook.entity.Expense;
import com.example.householdbook.service.ExpenseService;

@RestController
@RequestMapping("/api/expenses") // 全てのエンドポイントのベースパス
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
	this.expenseService = expenseService;
    }

    // CREATE: 新しい家計簿データを追加
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
	Expense savedExpense = expenseService.saveExpense(expense);
	return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }

    // READ: 全ての家計簿データを取得
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
	List<Expense> expenses = expenseService.findAllExpenses();
	return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // READ: 特定のIDの家計簿データを取得
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
	return expenseService.findExpenseById(id).map(expense -> new ResponseEntity<>(expense, HttpStatus.OK))
		.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE: 特定のIDの家計簿データを更新
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
	return expenseService.updateExpense(id, expense)
		.map(updatedExpense -> new ResponseEntity<>(updatedExpense, HttpStatus.OK))
		.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // DELETE: 特定のIDの家計簿データを削除
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
	if (expenseService.findExpenseById(id).isPresent()) {
	    expenseService.deleteExpense(id);
	    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	} else {
	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
    }
}
