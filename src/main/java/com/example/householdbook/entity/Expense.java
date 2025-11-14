package com.example.householdbook.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "EXPENSE") // Oracleのテーブル名に合わせて
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Oracle 12c以降のIDENTITYカラム用

    private Long id;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "type", nullable = false, length = 10) // 'INCOME' or 'EXPENSE'
    private String type;

    // --- コンストラクタ ---
    public Expense() {
    }

    public Expense(LocalDate transactionDate, String description, String category, BigDecimal amount, String type) {
	this.transactionDate = transactionDate;
	this.description = description;
	this.category = category;
	this.amount = amount;
	this.type = type;
    }

    // --- GetterとSetter ---
    public Long getId() {
	return id;
    }

    public void setId(Long id) {
	this.id = id;
    }

    public LocalDate getTransactionDate() {
	return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
	this.transactionDate = transactionDate;
    }

    public String getDescription() {
	return description;
    }

    public void setDescription(String description) {
	this.description = description;
    }

    public String getCategory() {
	return category;
    }

    public void setCategory(String category) {
	this.category = category;
    }

    public BigDecimal getAmount() {
	return amount;
    }

    public void setAmount(BigDecimal amount) {
	this.amount = amount;
    }

    public String getType() {
	return type;
    }

    public void setType(String type) {
	this.type = type;
    }

    @Override
    public String toString() {
	return "Expense{" + "id=" + id + ", transactionDate=" + transactionDate + ", description='" + description + '\''
		+ ", category='" + category + '\'' + ", amount=" + amount + ", type='" + type + '\'' + '}';
    }
}
