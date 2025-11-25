package com.example.householdbook.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.householdbook.entity.HouseholdTransaction;
import com.example.householdbook.repository.HouseholdTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor // finalフィールドのコンストラクタを自動生成
public class HouseholdTransactionService {

	private final HouseholdTransactionRepository transactionRepository;

	/**
	 * 全ての家計簿データを取得する
	 */
	@Transactional(readOnly = true)
	public List<HouseholdTransaction> findAllTransactions() {
		return transactionRepository.findAll();
	}

	/**
	 * IDを指定して家計簿データを取得する
	 */
	@Transactional(readOnly = true)
	public Optional<HouseholdTransaction> findTransactionById(Long id) {
		return transactionRepository.findById(id);
	}

	/**
	 * 新しい家計簿データを保存する
	 */
	public HouseholdTransaction saveTransaction(HouseholdTransaction transaction) {
		return transactionRepository.save(transaction);
	}

	/**
	 * 家計簿データを更新する
	 */
	public Optional<HouseholdTransaction> updateTransaction(Long id, HouseholdTransaction updatedTransaction) {
		return transactionRepository.findById(id).map(existingTransaction -> {
			existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
			existingTransaction.setDescription(updatedTransaction.getDescription());
			existingTransaction.setCategory(updatedTransaction.getCategory());
			existingTransaction.setAmount(updatedTransaction.getAmount());
			// Enum型への変更に対応
			existingTransaction.setType(updatedTransaction.getType());
			return transactionRepository.save(existingTransaction);
		});
	}

	/**
	 * IDを指定して家計簿データを削除する
	 */
	public void deleteTransaction(Long id) {
		transactionRepository.deleteById(id);
	}
}