package com.example.householdbook.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException; // 追加
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler; // 追加
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.householdbook.entity.Expense;
import com.example.householdbook.service.ExpenseService;

import jakarta.validation.Valid; // 追加

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
	this.expenseService = expenseService;
    }

    // CREATE: 新しい家計簿データを追加
    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) { // @Valid を追加
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
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expense) { // @Validを追加
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

    // バリデーションエラーハンドリング
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
	Map<String, String> errors = new HashMap<>();
	ex.getBindingResult().getAllErrors().forEach(error -> {
	    String fieldName = ((org.springframework.validation.FieldError) error).getField();
	    String errorMessage = error.getDefaultMessage();
	    errors.put(fieldName, errorMessage);
	});
	return errors;
    }
}
