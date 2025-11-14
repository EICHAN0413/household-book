package com.example.householdbook.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "EXPENSE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "日付は必須です")
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @NotBlank(message = "説明は必須です")
    @Size(max = 255, message = "説明は255文字以内で入力してください")
    @Column(name = "description", nullable = false)
    private String description;

    @NotBlank(message = "カテゴリは必須です")
    @Size(max = 100, message = "カテゴリは100文字以内で入力してください")
    @Column(name = "category", nullable = false)
    private String category;

    @NotNull(message = "金額は必須です")
    @DecimalMin(value = "0.01", message = "金額は0より大きい値を入力してください")
    @Digits(integer = 8, fraction = 2, message = "金額は整数部8桁、小数部2桁までです")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank(message = "収支種別は必須です")
    @Pattern(regexp = "INCOME|EXPENSE", message = "収支種別は'INCOME'または'EXPENSE'である必要があります")
    @Column(name = "type", nullable = false, length = 10)
    private String type;
}
