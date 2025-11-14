package com.example.householdbook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.householdbook.entity.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // カスタムクエリが必要な場合はここに追加
    // 例: List<Expense> findByCategory(String category);
}
