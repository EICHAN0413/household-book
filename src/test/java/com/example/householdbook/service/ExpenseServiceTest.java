package com.example.householdbook.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.householdbook.entity.Expense;
import com.example.householdbook.repository.ExpenseRepository;

@ExtendWith(MockitoExtension.class) // Mockito を使用するために必要
public class ExpenseServiceTest {

    @Mock // ExpenseRepository をモック化
    private ExpenseRepository expenseRepository;

    @InjectMocks // モック化したリポジトリを ExpenseService に注入
    private ExpenseService expenseService;

    private Expense expense1;
    private Expense expense2;
    private Expense expense3;

    @BeforeEach
    void setUp() {
	// 各テストの前に実行される共通のセットアップ
	expense1 = new Expense(1L, LocalDate.of(2023, 11, 20), "ランチ代", "食費", new BigDecimal("850.50"), "EXPENSE");
	expense2 = new Expense(2L, LocalDate.of(2023, 11, 15), "給料", "給与", new BigDecimal("250000.00"), "INCOME");
	expense3 = new Expense(3L, LocalDate.of(2023, 11, 25), "飲み会代", "交際費", new BigDecimal("10000.00"), "EXPENSE");
    }

    @Test
    @DisplayName("全ての家計簿データを取得できること")
    void testFindAllExpenses() {
	// モックの振る舞いを定義
	when(expenseRepository.findAll()).thenReturn(Arrays.asList(expense1, expense2, expense3));

	// サービスメソッドを実行
	List<Expense> expenses = expenseService.findAllExpenses();

	// 結果を検証
	assertNotNull(expenses);
	assertEquals(3, expenses.size());
	assertEquals("ランチ代", expenses.get(0).getDescription());
	assertEquals("給料", expenses.get(1).getDescription());
	assertEquals("飲み会代", expenses.get(2).getDescription());

	// expenseRepository.findAll() が1回呼び出されたことを確認
	verify(expenseRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("IDを指定して家計簿データを取得できること")
    void testFindExpenseById() {
	// モックの振る舞いを定義
	when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense1));

	// サービスメソッドを実行
	Optional<Expense> foundExpense = expenseService.findExpenseById(1L);

	// 結果を検証
	assertTrue(foundExpense.isPresent());
	assertEquals("ランチ代", foundExpense.get().getDescription());

	// 存在しないIDの場合
	when(expenseRepository.findById(3L)).thenReturn(Optional.empty());
	Optional<Expense> notFoundExpense = expenseService.findExpenseById(3L);
	assertFalse(notFoundExpense.isPresent());

	verify(expenseRepository, times(2)).findById(anyLong()); // 1Lと3Lで2回呼び出し
    }

    @Test
    @DisplayName("家計簿データを新規保存できること")
    void testSaveExpense() {
	// モックの振る舞いを定義: saveが呼ばれたら引数として渡されたExpenseを返す
	when(expenseRepository.save(any(Expense.class))).thenReturn(expense1);

	// サービスメソッドを実行
	Expense savedExpense = expenseService.saveExpense(expense1);

	// 結果を検証
	assertNotNull(savedExpense);
	assertEquals("ランチ代", savedExpense.getDescription());
	assertEquals(1L, savedExpense.getId());

	verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    @DisplayName("家計簿データを更新できること")
    void testUpdateExpense() {
	Expense updatedDetails = new Expense(10L, LocalDate.of(2023, 11, 21), "カフェ代", "食費", new BigDecimal("500.00"),
		"EXPENSE");

	// モックの振る舞いを定義
	when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense1));
	when(expenseRepository.save(any(Expense.class))).thenReturn(expense1); // 更新されたexpense1を返す

	// サービスメソッドを実行
	Optional<Expense> result = expenseService.updateExpense(1L, updatedDetails);

	// 結果を検証
	assertTrue(result.isPresent());
	assertEquals("カフェ代", result.get().getDescription());
	assertEquals(new BigDecimal("500.00"), result.get().getAmount());

	verify(expenseRepository, times(1)).findById(1L);
	verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    @DisplayName("存在しないIDの家計簿データの更新は失敗すること")
    void testUpdateExpenseNotFound() {
	Expense updatedDetails = new Expense(5L, LocalDate.of(2023, 11, 21), "カフェ代", "食費", new BigDecimal("500.00"),
		"EXPENSE");
	when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

	Optional<Expense> result = expenseService.updateExpense(99L, updatedDetails);

	assertFalse(result.isPresent());
	verify(expenseRepository, times(1)).findById(99L);
	verify(expenseRepository, never()).save(any(Expense.class)); // saveが呼ばれていないことを確認
    }

    @Test
    @DisplayName("家計簿データを削除できること")
    void testDeleteExpense() {

	// 削除対象が存在する場合: findById で Optional.of(expense3) を返す
	when(expenseRepository.existsById(3L)).thenReturn(true);
	doNothing().when(expenseRepository).deleteById(3L);

	// サービスメソッドを実行
	expenseService.deleteExpense(3L);

	// findById と deleteById がそれぞれ1回ずつ呼ばれたことを確認
	verify(expenseRepository, times(1)).existsById(3L);
	verify(expenseRepository, times(1)).deleteById(3L);
    }

    @Test
    @DisplayName("存在しない家計簿データは削除できないこと")
    void testNotDeleteexpense() {

	// 存在しない場合
	when(expenseRepository.existsById(11L)).thenReturn(false);

	// 削除メソッドを呼ぶ
	expenseService.deleteExpense(11L);

	// deleteById は呼ばれていないことを検証
	verify(expenseRepository, times(1)).existsById(11L);
	verify(expenseRepository, never()).deleteById(anyLong());
    }
}
