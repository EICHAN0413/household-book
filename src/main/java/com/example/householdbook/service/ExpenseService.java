package com.example.householdbook.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.householdbook.entity.Expense;
import com.example.householdbook.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor; // finalフィールドのコンストラクタを生成
import lombok.extern.slf4j.Slf4j; // Loggerを自動生成

@Service
@Transactional
@Slf4j // Logger log; が自動生成される
@RequiredArgsConstructor // finalフィールド（expenseRepository）のコンストラクタを自動生成
public class ExpenseService {

    private final ExpenseRepository expenseRepository; // final に変更

    // @Autowired コンストラクタは不要になる (Lombokの@RequiredArgsConstructorが生成)

    /**
     * 全ての家計簿データを取得する
     * 
     * @return 家計簿データのリスト
     */
    public List<Expense> findAllExpenses() {
	log.debug("すべての家計簿データを検索中...");
	List<Expense> expenses = expenseRepository.findAll();
	log.debug("{}件の家計簿データが見つかりました。", expenses.size());
	return expenses;
    }

    /**
     * IDを指定して家計簿データを取得する
     * 
     * @param id 家計簿ID
     * @return Optional<Expense>
     */
    public Optional<Expense> findExpenseById(Long id) {
	log.debug("該当の家計簿データを取得中");
	Optional<Expense> expense = expenseRepository.findById(id);
	if (expense.isPresent()) {
	    log.debug("ID={} のデータが見つかりました: {}", id, expense.get());
	} else {
	    log.warn("ID={} のデータは存在しません", id);
	}
	return expense;
    }

    /**
     * 新しい家計簿データを保存する (Create / Update)
     * 
     * @param expense 保存する家計簿データ
     * @return 保存された家計簿データ
     */
    public Expense saveExpense(Expense expense) {
	log.debug("家計簿データを保存中: {}", expense);
	Expense savedExpense = expenseRepository.save(expense);
	log.debug("保存完了: {}", savedExpense);
	return savedExpense;
    }

    /**
     * 家計簿データを更新する
     * 
     * @param id             更新対象の家計簿ID
     * @param updatedExpense 更新内容
     * @return 更新された家計簿データ (存在しない場合はOptional.empty())
     */
    public Optional<Expense> updateExpense(Long id, Expense updatedExpense) {
	log.debug("ID={} の家計簿データを更新開始: {}", id, updatedExpense);

	return expenseRepository.findById(id).map(expense -> {
	    // 値の更新
	    expense.setTransactionDate(updatedExpense.getTransactionDate());
	    expense.setDescription(updatedExpense.getDescription());
	    expense.setCategory(updatedExpense.getCategory());
	    expense.setAmount(updatedExpense.getAmount());
	    expense.setType(updatedExpense.getType());

	    Expense saved = expenseRepository.save(expense);

	    log.debug("ID={} の更新完了: {}", id, saved);
	    return saved;
	}).or(() -> {
	    // 対象データが存在しない場合
	    log.warn("ID={} の家計簿データが存在せず、更新できませんでした。", id);
	    return Optional.empty();
	});
    }

    /**
     * IDを指定して家計簿データを削除する
     * 
     * @param id 削除対象の家計簿ID
     */
    public void deleteExpense(Long id) {
	log.debug("ID={} の家計簿データ削除処理を開始", id);
	if (expenseRepository.existsById(id)) {
	    expenseRepository.deleteById(id);
	    log.debug("ID={} の家計簿データを削除しました", id);
	} else {
	    log.warn("ID={} のデータは存在せず削除できません", id);
	}
    }
}
