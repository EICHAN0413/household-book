package com.example.householdbook.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.householdbook.entity.HouseholdTransaction;
import com.example.householdbook.service.HouseholdTransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions") 
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Validated
public class HouseholdTransactionController {

	private final HouseholdTransactionService transactionService;

	// CREATE
	@PostMapping
	public ResponseEntity<HouseholdTransaction> createTransaction(
			@Valid @RequestBody HouseholdTransaction transaction) {
		HouseholdTransaction savedTransaction = transactionService.saveTransaction(transaction);
		return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
	}

	// READ (All)
	@GetMapping
	public ResponseEntity<List<HouseholdTransaction>> getAllTransactions() {
		List<HouseholdTransaction> transactions = transactionService.findAllTransactions();
		return new ResponseEntity<>(transactions, HttpStatus.OK);
	}

	// READ (One)
	@GetMapping("/{id}")
	public ResponseEntity<HouseholdTransaction> getTransactionById(@PathVariable Long id) {
		return transactionService.findTransactionById(id)
				.map(transaction -> new ResponseEntity<>(transaction, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// UPDATE
	@PutMapping("/{id}")
	public ResponseEntity<HouseholdTransaction> updateTransaction(@PathVariable Long id,
			@Valid @RequestBody HouseholdTransaction transaction) {
		return transactionService.updateTransaction(id, transaction)
				.map(updatedTransaction -> new ResponseEntity<>(updatedTransaction, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
		if (transactionService.findTransactionById(id).isPresent()) {
			transactionService.deleteTransaction(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}