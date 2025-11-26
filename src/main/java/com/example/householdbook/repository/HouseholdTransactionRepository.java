package com.example.householdbook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.householdbook.entity.HouseholdTransaction;

@Repository
public interface HouseholdTransactionRepository extends JpaRepository<HouseholdTransaction, Long> {
    // カテゴリ検索などが必要になった場合の例
    // List<HouseholdTransaction> findByCategory(String category);
}